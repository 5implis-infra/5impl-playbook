// @ts-check
import { defineConfig } from "astro/config";
import Icons from "starlight-plugin-icons";
import mdx from "@astrojs/mdx";
import starlightHeadingBadges from "starlight-heading-badges";
import starlightAutoSidebar from "starlight-auto-sidebar";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightScrollToTop from "starlight-scroll-to-top";
import UnoCSS from "unocss/astro";
import starlightCopyButton from "starlight-copy-button";
import { tsconfigMonoRepoPaths } from "@5implis/utils/plugins/vite";
import mermaid from "astro-mermaid";

//import { createCompResolver } from "@5implis/design-system/plugin";
//const comp = createCompResolver(import.meta.url);

export default defineConfig({
  site: "https://docs.5impl.is/",
  redirects: {
    "/": "/pt/",
  },
  integrations: [
    UnoCSS(),
    Icons({
      sidebar: true,
      codeblock: true,
      extractSafelist: true,
      starlight: {
        title: "5impl.is Playbook",
        logo: {
          light: "./src/assets/logo-light.svg",
          dark: "./src/assets/logo-dark.svg",
          replacesTitle: true,
        },
        favicon: "/favicon.svg",
        defaultLocale: "pt",
        locales: {
          pt: { label: "Português", lang: "pt-BR" },
          en: { label: "English", lang: "en" },
        },
        social: [
          {
            icon: "github",
            label: "GitHub",
            href: "https://github.com/5implis-infra",
          },
          { icon: "external", label: "Site", href: "https://5impl.is" },
        ],
        customCss: ["@5implis/design-system/styles"],
        components: {
          Header: "@components/Header",
          ThemeSelect: "@components/ThemeToggle",
          LanguageSelect: "@components/LangToggle",
          Head: "@components/overrides/Head",
          Footer: "@components/overrides/Footer",
        },
        expressiveCode: {
          themes: ["dark-plus", "github-light"],
        },
        plugins: [
          starlightHeadingBadges(),
          starlightAutoSidebar(),
          starlightLlmsTxt(),
          starlightScrollToTop(),
          starlightCopyButton(),
        ],
      },
    }),
    mdx(),
    mermaid({
      theme: "forest",
      autoTheme: true,
      mermaidConfig: {
        flowchart: {
          curve: "basis",
        },
      },
    }),
  ],
  vite: {
    plugins: [tsconfigMonoRepoPaths({ prefix: "@5implis/", debug: false })],
  },
});
