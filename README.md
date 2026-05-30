# 5implis Docs — Monorepo

Monorepo de documentação da 5implis, estruturado com **pnpm workspaces** e **Astro + Starlight**.

## Estrutura

```
5impl-playbook/
├── apps/
│   ├── consulting-playbook/   — Playbook técnico (docs.5impl.is)
│   └── consulting-b2b/        — Portal do cliente (cliente.5implis.com)
├── packages/
│   └── design-system/         — CSS compartilhado (@5implis/design-system)
├── church/                    — Placeholder Church Platform
└── pnpm-workspace.yaml
```

## Comandos

Todos os comandos são executados a partir da raiz do repositório.

| Comando                          | Ação                                             |
| :------------------------------- | :----------------------------------------------- |
| `pnpm install`                   | Instala dependências de todos os workspaces      |
| `pnpm dev:playbook`              | Dev server do playbook em `localhost:4321`       |
| `pnpm dev:b2b`                   | Dev server do portal em `localhost:4322`         |
| `pnpm build:playbook`            | Build de produção do playbook                    |
| `pnpm build:b2b`                 | Build de produção do portal                      |
| `pnpm build:all`                 | Build dos dois apps                              |

## Apps

### `apps/consulting-playbook`

Playbook técnico interno — arquitetura, agentes, fluxos, schemas, provisionamento.

- URL de produção: `https://docs.5impl.is`
- Stack: Astro + Starlight + UnoCSS + Mermaid
- Idiomas: `pt-BR` / `en`

### `apps/consulting-b2b`

Portal do cliente — documentação voltada para clientes da consultoria.

- URL de produção: `https://cliente.5implis.com`
- Stack: Astro + Starlight + UnoCSS
- Idioma: `pt-BR`

## Packages

### `packages/design-system`

Source único do CSS de tema (`@5implis/design-system/styles`). Ambos os apps importam daqui — nenhum app tem CSS próprio de tema.

## Deploy — Cloudflare Pages

Cada app é um projeto separado no Cloudflare Pages apontando para o mesmo repositório:

| Projeto CF            | Root directory             | Build command | Output dir |
| --------------------- | -------------------------- | ------------- | ---------- |
| `consulting-playbook` | `apps/consulting-playbook` | `pnpm build`  | `dist`     |
| `consulting-b2b`      | `apps/consulting-b2b`      | `pnpm build`  | `dist`     |

Variável de ambiente necessária em cada projeto: `PNPM_VERSION=latest`.
