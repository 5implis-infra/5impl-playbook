# Plano: Migração para Monorepo Modelo B (packages/ + apps/)

## Contexto

O projeto atual tem dois sites Astro (`5impl-playbook/` raiz e `portal/`) gerenciados com npm workspaces simples. A decisão é migrar para um monorepo `packages/ + apps/` com pnpm, onde:

- `packages/design-system` é o único source of truth do CSS (hoje duplicado em 2 lugares)
- `apps/consulting-playbook` e `apps/consulting-b2b` são projetos Astro independentes
- `church/` é um placeholder para o futuro produto Church
- Cada app tem seu próprio deploy no Cloudflare Pages via root directory diferente

O monorepo usa **pnpm** (não npm) — pnpm resolve peer deps corretamente em workspaces e não exige `--legacy-peer-deps`.

---

## Estado atual → Estado alvo

**Atual:**

```
5impl-playbook/            ← tech site (root)
  astro.config.mjs
  package.json
  src/
  portal/                  ← b2b site
    astro.config.mjs
    package.json
    src/
```

**Alvo:**

```
5impl-playbook/            ← mesmo repo, estrutura interna reorganizada
  pnpm-workspace.yaml
  package.json             ← root: scripts globais, private: true
  packages/
    design-system/
      package.json         ← @5implis/design-system
      src/
        styles/
          custom.css       ← source único do design system CSS
  apps/
    consulting-playbook/   ← tech site movido aqui
      package.json
      astro.config.mjs
      tsconfig.json
      src/
        assets/            ← logos permanecem aqui (específicos do app)
        components/
        content/
        styles/            ← removido (CSS vem do package)
    consulting-b2b/        ← portal/ movido aqui
      package.json
      astro.config.mjs
      tsconfig.json
      src/
        assets/            ← logos permanecem aqui
        components/
        content/
        styles/            ← removido (CSS vem do package)
  church/
    README.md              ← placeholder
```

---

## Fase 1 — Instalar pnpm e criar a estrutura base

### 1.1 Verificar/instalar pnpm

```bash
npm install -g pnpm
```

### 1.2 Criar `pnpm-workspace.yaml` na raiz

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

### 1.3 Criar `package.json` raiz (substituir o atual)

```json
{
  "name": "5implis-docs",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev:playbook": "pnpm --filter consulting-playbook dev",
    "dev:b2b": "pnpm --filter consulting-b2b dev",
    "build:playbook": "pnpm --filter consulting-playbook build",
    "build:b2b": "pnpm --filter consulting-b2b build",
    "build:all": "pnpm --filter './apps/*' build"
  }
}
```

---

## Fase 2 — Criar `packages/design-system`

### 2.1 `packages/design-system/package.json`

```json
{
  "name": "@5implis/design-system",
  "version": "1.0.0",
  "private": true,
  "exports": {
    "./styles": "./src/styles/custom.css"
  }
}
```

### 2.2 Mover o CSS

```
src/styles/custom.css  →  packages/design-system/src/styles/custom.css
```

O arquivo CSS não muda — apenas sua localização. O `portal/src/styles/custom.css` (cópia) é deletado.

---

## Fase 3 — Mover apps para `apps/`

### 3.1 Mover tech site

```
# Usar git mv para preservar histórico
git mv astro.config.mjs        apps/consulting-playbook/astro.config.mjs
git mv tsconfig.json           apps/consulting-playbook/tsconfig.json
git mv src/                    apps/consulting-playbook/src/
# (src/styles/ não vai junto — foi movido para packages/)
```

> Nota: os arquivos de raiz que NÃO vão para o app: `package.json` (substituído pelo root), `pnpm-workspace.yaml` (novo), `DESIGN.md`, `PRODUCT.md`, `CONTEXT.md`, `docs/`, `drafts/` (ficam na raiz como documentação do projeto).

### 3.2 Mover portal

```
git mv portal/astro.config.mjs  apps/consulting-b2b/astro.config.mjs
git mv portal/tsconfig.json     apps/consulting-b2b/tsconfig.json
git mv portal/src/              apps/consulting-b2b/src/
# portal/src/styles/ não vai junto (CSS vem do package agora)
```

### 3.3 Criar `church/README.md`

```markdown
# Church Platform Docs

Placeholder para os sites de documentação da Church Platform (playbook técnico e portal do cliente).

- `church/playbook/` — documentação técnica (a criar)
- `church/b2b/` — portal do cliente (a criar)
```

---

## Fase 4 — Atualizar `package.json` de cada app

### `apps/consulting-playbook/package.json`

```json
{
  "name": "consulting-playbook",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@5implis/design-system": "workspace:*",
    "@astrojs/mdx": "^5.0.6",
    "@astrojs/starlight": "^0.39.2",
    "astro": "^6.3.1",
    "mermaid": "^11.15.0",
    "sharp": "^0.34.5",
    "starlight-auto-sidebar": "^0.4.0",
    "starlight-copy-button": "github:dionysuzx/starlight-copy-button",
    "starlight-heading-badges": "^0.7.0",
    "starlight-llms-txt": "^0.10.0",
    "starlight-plugin-icons": "^1.1.6",
    "starlight-scroll-to-top": "^1.0.1"
  },
  "devDependencies": {
    "@iconify-json/material-icon-theme": "^1.2.66",
    "@unocss/astro": "^66.7.0",
    "unocss": "^66.7.0"
  }
}
```

### `apps/consulting-b2b/package.json`

```json
{
  "name": "consulting-b2b",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev --port 4322",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@5implis/design-system": "workspace:*",
    "@astrojs/mdx": "^5.0.6",
    "@astrojs/starlight": "^0.39.2",
    "astro": "^6.3.1",
    "sharp": "^0.34.5",
    "starlight-auto-sidebar": "^0.4.0",
    "starlight-heading-badges": "^0.7.0",
    "starlight-scroll-to-top": "^1.0.1"
  },
  "devDependencies": {
    "@unocss/astro": "^66.7.0",
    "unocss": "^66.7.0"
  }
}
```

---

## Fase 5 — Atualizar `astro.config.mjs` de cada app

### Mudança chave em ambos os configs

Substituir:

```js
customCss: ['./src/styles/custom.css'],
```

Por:

```js
customCss: ['@5implis/design-system/styles'],
```

Nenhuma outra alteração no config é necessária. Os paths de logo (`./src/assets/logo-*.svg`) permanecem relativos ao app — os logos ficam em cada app.

---

## Fase 6 — Atualizar imports de componentes no consulting-playbook

O `MermaidDiagram.astro` está em `src/components/shared/MermaidDiagram.astro`. Os imports nos MDX usam `@components/MermaidDiagram.astro` via alias TypeScript.

Verificar se o alias `@components` está configurado no `tsconfig.json` do app:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "paths": {
      "@components/*": ["./src/components/*"]
    }
  }
}
```

Se não estiver, adicionar. Nenhuma mudança nos arquivos MDX.

---

## Fase 7 — Instalar e verificar

```bash
# Na raiz do monorepo
pnpm install

# Build de cada app separadamente
pnpm --filter consulting-playbook build
pnpm --filter consulting-b2b build

# Dev de cada app
pnpm dev:playbook  # localhost:4321
pnpm dev:b2b      # localhost:4322
```

---

## Fase 8 — Configuração Cloudflare Pages (não é código — é documentação)

Para cada site, criar um **projeto separado** no Cloudflare Pages apontando para o mesmo repositório:

| Projeto CF            | Root directory             | Build command | Output dir | Custom domain                          |
| --------------------- | -------------------------- | ------------- | ---------- | -------------------------------------- |
| `consulting-playbook` | `apps/consulting-playbook` | `pnpm build`  | `dist`     | `docs.5impl.is` ou `playbook.5impl.is` |
| `consulting-b2b`      | `apps/consulting-b2b`      | `pnpm build`  | `dist`     | `cliente.5implis.com`                  |
| `church-b2b` (futuro) | `apps/church-b2b`          | `pnpm build`  | `dist`     | `church.5implis.com`                   |

Variável de ambiente necessária em cada projeto: `PNPM_VERSION=latest` (para o Cloudflare usar pnpm no build).

---

## Ordem de execução

1. `pnpm install -g` (se pnpm não estiver instalado)
2. Criar `pnpm-workspace.yaml`
3. Criar `packages/design-system/` (package.json + mover CSS)
4. `git mv` dos arquivos do tech site para `apps/consulting-playbook/`
5. `git mv` dos arquivos do portal para `apps/consulting-b2b/`
6. Deletar `portal/` (já esvaziado pelo mv)
7. Deletar `src/styles/` do tech site (já movido para packages)
8. Criar `church/README.md`
9. Atualizar `package.json` de cada app
10. Atualizar `astro.config.mjs` de cada app (customCss)
11. Substituir `package.json` da raiz
12. Verificar/adicionar alias `@components` no tsconfig do playbook
13. `pnpm install`
14. `pnpm build:all` — verificar zero erros
15. `pnpm dev:playbook` e `pnpm dev:b2b` — verificar visual idêntico

---

## Verificação final

- Tech site em `localhost:4321`: visual idêntico ao atual, Mermaid funciona, sidebar correto
- B2B portal em `localhost:4322`: visual idêntico ao atual, sem diagramas técnicos
- `packages/design-system/src/styles/custom.css` é o único CSS — deletar os arquivos de estilo dos apps e confirmar que os sites continuam corretos
- `pnpm build:all` compila sem erros em ambos
