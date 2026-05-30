// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import mdx from '@astrojs/mdx'
import starlightHeadingBadges from 'starlight-heading-badges'
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightScrollToTop from 'starlight-scroll-to-top'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  site: 'https://cliente.5implis.com/',
  redirects: {
    '/': '/pt/',
  },
  integrations: [
    UnoCSS(),
    starlight({
      title: '5implis | Portal do Cliente',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      defaultLocale: 'pt',
      locales: {
        pt: { label: 'Português', lang: 'pt-BR' },
        en: { label: 'English', lang: 'en' },
      },
      social: [
        { icon: 'external', label: 'Site', href: 'https://5implis.com' },
      ],
      customCss: ['@5implis/design-system/styles'],
      components: {
        Header: '@5implis/design-system/components/Header',
        ThemeSelect: '@5implis/design-system/components/ThemeToggle',
        LanguageSelect: '@5implis/design-system/components/LangToggle',
        Head: './src/components/overrides/Head.astro',
        Footer: './src/components/overrides/Footer.astro',
      },
      expressiveCode: {
        themes: ['dark-plus', 'github-light'],
      },
      plugins: [
        starlightHeadingBadges(),
        starlightAutoSidebar(),
        starlightScrollToTop(),
      ],
    }),
    mdx(),
  ],
})
