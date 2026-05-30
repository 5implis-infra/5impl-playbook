// @ts-check
import { defineConfig } from 'astro/config'
import Icons from 'starlight-plugin-icons'
import mdx from '@astrojs/mdx'
import starlightHeadingBadges from 'starlight-heading-badges'
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightLlmsTxt from 'starlight-llms-txt'
import starlightScrollToTop from 'starlight-scroll-to-top'
import UnoCSS from 'unocss/astro'
import starlightCopyButton from 'starlight-copy-button'

export default defineConfig({
  site: 'https://docs.5impl.is/',
  integrations: [
    UnoCSS(),
    Icons({
      sidebar: true,
      codeblock: true,
      extractSafelist: true,
      starlight: {
        title: '5impl.is Playbook',
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
          { icon: 'github', label: 'GitHub', href: 'https://github.com/5implis-infra' },
          { icon: 'external', label: 'Site', href: 'https://5impl.is' },
        ],
        customCss: ['@5implis/design-system/styles'],
        components: {
          ThemeSelect: '@5implis/design-system/components/ThemeToggle',
          LanguageSelect: '@5implis/design-system/components/LangToggle',
          Head: './src/components/overrides/Head.astro',
          Footer: './src/components/overrides/Footer.astro',
          PageFrame: './src/components/overrides/PageFrame.astro',
        },
        expressiveCode: {
          themes: ['dark-plus', 'github-light'],
        },
        plugins: [starlightHeadingBadges(), starlightAutoSidebar(), starlightLlmsTxt(), starlightScrollToTop(), starlightCopyButton()],
      },
    }),
    mdx(),
  ],
})
