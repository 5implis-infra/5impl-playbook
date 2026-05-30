import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

// Helper function to load and parse tsconfig.json (handling comments)
function loadTsConfig(appDir) {
  const tsConfigPath = path.join(appDir, "tsconfig.json");
  if (!fs.existsSync(tsConfigPath)) return null;
  try {
    const rawContent = fs.readFileSync(tsConfigPath, "utf-8");
    // Strip simple comments like // and /* ... */ to safely parse as JSON
    const cleanContent = rawContent.replace(
      /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,
      "$1",
    );
    return JSON.parse(cleanContent);
  } catch (e) {
    return null;
  }
}

// Helper function to map a source import using tsconfig path mappings
function mapTsConfigPaths(source, tsconfig, appDir) {
  if (
    !tsconfig ||
    !tsconfig.compilerOptions ||
    !tsconfig.compilerOptions.paths
  ) {
    return [source];
  }

  const paths = tsconfig.compilerOptions.paths;
  const baseUrl = tsconfig.compilerOptions.baseUrl || ".";
  const baseDir = path.resolve(appDir, baseUrl);

  // Sort paths by descending pattern length to ensure more specific patterns (like @components/*)
  // are matched before less specific/shorter patterns (like @/*)
  const sortedPaths = Object.entries(paths).sort(
    (a, b) => b[0].length - a[0].length,
  );

  for (const [aliasPattern, targetPatterns] of sortedPaths) {
    if (aliasPattern.endsWith("/*")) {
      const prefix = aliasPattern.slice(0, -1); // e.g. "@components/" instead of "@components"
      if (source.startsWith(prefix)) {
        const wildcardValue = source.slice(prefix.length);
        return targetPatterns.map((pattern) => {
          const target = pattern.replace("*", wildcardValue);
          if (target.startsWith(".")) {
            return path.resolve(baseDir, target);
          }
          return target;
        });
      }
    } else if (aliasPattern === source) {
      return targetPatterns.map((pattern) => {
        if (pattern.startsWith(".")) {
          return path.resolve(baseDir, pattern);
        }
        return pattern;
      });
    }
  }

  return [source];
}

export function tsconfigMonoRepoPaths(
  options = { prefix: "@/", debug: false },
) {
  const debug = options.debug;
  const prefix = options.prefix;
  return {
    name: "vite-monorepo-tsconfig-paths",
    async resolveId(source, importer) {
      if (debug)
        console.log(
          `[vite-monorepo-tsconfig-paths] resolveId prefix="${prefix}", source="${source}", importer="${importer}"`,
        );
      const appDir = options.appDir || process.cwd();
      const tsconfig = loadTsConfig(appDir);

      // 1. Resolve source using paths defined in the local tsconfig.json dynamically
      const candidateSources = mapTsConfigPaths(source, tsconfig, appDir);
      if (debug)
        console.log(
          `[vite-monorepo-tsconfig-paths] candidateSources:`,
          candidateSources,
        );

      for (let resolvedSource of candidateSources) {
        // If the path was mapped to an absolute local filesystem path, check if it exists
        if (path.isAbsolute(resolvedSource)) {
          const extensions = [".astro", ".ts", ".tsx", ".js", ".jsx", ".css"];
          if (
            fs.existsSync(resolvedSource) &&
            fs.lstatSync(resolvedSource).isFile()
          ) {
            if (debug)
              console.log(
                `[vite-monorepo-tsconfig-paths] Resolved to absolute path: ${resolvedSource}`,
              );
            return resolvedSource;
          }
          for (const ext of extensions) {
            const pathWithExt = resolvedSource + ext;
            if (fs.existsSync(pathWithExt)) {
              if (debug)
                console.log(
                  `[vite-monorepo-tsconfig-paths] Resolved absolute path with extension: ${pathWithExt}`,
                );
              return pathWithExt;
            }
          }
          continue; // Try next candidate if not found
        }

        // 2. Intercept monorepo scoped imports (e.g. starts with "@<prefix>/")
        if (resolvedSource.startsWith(prefix)) {
          if (debug)
            console.log(
              `[vite-monorepo-tsconfig-paths] Scoped monorepo import detected: ${resolvedSource}`,
            );
          const parts = resolvedSource.split("/");
          const packageName = parts[1]; // e.g. "design-system"
          const subpath = parts.slice(2).join("/"); // e.g. "components/overrides/Footer"

          // Locate monorepo root dynamically by finding pnpm-workspace.yaml
          let currentDir = appDir;
          let monorepoRoot = null;
          for (let i = 0; i < 5; i++) {
            if (fs.existsSync(path.join(currentDir, "pnpm-workspace.yaml"))) {
              monorepoRoot = currentDir;
              break;
            }
            currentDir = path.dirname(currentDir);
          }

          if (!monorepoRoot) {
            const thisFileDir = path.dirname(fileURLToPath(import.meta.url));
            monorepoRoot = path.resolve(thisFileDir, "../../../");
          }

          // Search in packages/ or apps/ dynamically
          let packageDir = path.resolve(monorepoRoot, "packages", packageName);
          if (!fs.existsSync(packageDir)) {
            packageDir = path.resolve(monorepoRoot, "apps", packageName);
          }
          if (!fs.existsSync(packageDir)) continue;

          // Read target package.json dynamically to resolve standard ESM exports
          const pkgJsonPath = path.join(packageDir, "package.json");
          if (!fs.existsSync(pkgJsonPath)) continue;

          const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
          if (!pkg.exports) continue;

          let resolvedSubpath = null;
          const subpathKey = `./${subpath}`;

          // Exact match
          if (pkg.exports[subpathKey]) {
            resolvedSubpath = pkg.exports[subpathKey];
          } else {
            // Wildcard pattern match (e.g. "./components/*")
            for (const [key, val] of Object.entries(pkg.exports)) {
              if (key.includes("*")) {
                const prefix = key.replace("*", "");
                if (subpathKey.startsWith(prefix)) {
                  const wildcardValue = subpathKey.slice(prefix.length);
                  resolvedSubpath = val.replace("*", wildcardValue);
                  break;
                }
              }
            }
          }

          if (!resolvedSubpath) {
            if (debug)
              console.log(
                `[vite-monorepo-tsconfig-paths] Could not resolve subpath ${subpathKey} in exports`,
              );
            continue;
          }

          const absolutePath = path.resolve(packageDir, resolvedSubpath);
          if (debug)
            console.log(
              `[vite-monorepo-tsconfig-paths] Mapped to physical path: ${absolutePath}`,
            );

          // Fallback extensions resolver
          const extensions = [".astro", ".ts", ".tsx", ".js", ".jsx", ".css"];
          if (
            fs.existsSync(absolutePath) &&
            fs.lstatSync(absolutePath).isFile()
          ) {
            if (debug)
              console.log(
                `[vite-monorepo-tsconfig-paths] File exists as is: ${absolutePath}`,
              );
            return absolutePath;
          }
          for (const ext of extensions) {
            const pathWithExt = absolutePath + ext;
            if (fs.existsSync(pathWithExt)) {
              if (debug)
                console.log(
                  `[vite-monorepo-tsconfig-paths] File exists with extension: ${pathWithExt}`,
                );
              return pathWithExt;
            }
          }
          if (debug)
            console.log(
              `[vite-monorepo-tsconfig-paths] File not found with extensions at: ${absolutePath}`,
            );
        }
      }

      if (debug)
        console.log(
          `[vite-monorepo-tsconfig-paths] Could not resolve ${source}`,
        );
      return null;
    },
  };
}
