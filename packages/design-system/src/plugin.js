import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho absoluto para os componentes do próprio design-system
const dsComponents = path.join(__dirname, "components");

/**
 * Cria um resolver de componentes Starlight com fallback para o design-system.
 *
 * Uso no astro.config.mjs do app:
 *   import { createCompResolver } from "@5implis/design-system/plugin";
 *   const comp = createCompResolver(import.meta.url);
 *
 * @param {string} importMetaUrl - Passe `import.meta.url` do astro.config.mjs do app
 * @returns {(name: string) => string} Função que resolve o caminho absoluto do componente
 */
export function createCompResolver(importMetaUrl) {
  const appDir = path.dirname(fileURLToPath(importMetaUrl));
  const localComponents = path.join(appDir, "src", "components");

  /**
   * Resolve o caminho absoluto de um componente Astro.
   * Prioridade: src/components/<name>.astro do app → design-system
   *
   * @param {string} name - Nome do componente, ex: "Header" ou "overrides/Footer"
   * @returns {string} Caminho absoluto para o arquivo .astro
   */
  return function comp(name) {
    const localPath = path.join(localComponents, name + ".astro");
    if (fs.existsSync(localPath)) return localPath;
    return path.join(dsComponents, name + ".astro");
  };
}
