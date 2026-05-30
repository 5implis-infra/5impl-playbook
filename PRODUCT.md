# Product

## Register

product

## Users

O Playbook serve dois perfis com necessidades distintas:

**Operador**
Engenheiro ou fundador da 5implis que constrói e opera a plataforma. Alta familiaridade técnica. Lê o Playbook nos três contextos de navegação: busca rápida por um field name ou trigger, aprendizado profundo de uma seção de arquitetura, consulta recorrente de referência durante desenvolvimento. É o público primário do Playbook.

**Cliente B2B**
Empresário com habilidade técnica leve — entusiasta digital que usa a plataforma 5implis para alavancar seu negócio sem fricção com a TI. Acessa o Playbook durante onboarding ou engagements ativos para verificar o que foi construído para ele: fluxos, agentes em linguagem de negócio, integrações. Não lê schemas TypeScript ou código diretamente. *O domínio primário para este perfil será um site separado no futuro — ver [ADR-0001](docs/adr/0001-separacao-audiencia-por-secao.md).*

### Três Contextos de Navegação

Qualquer usuário pode estar em um destes modos em um dado momento:

1. **Busca rápida** — sabe o que procura, precisa encontrar em segundos
2. **Aprendizado profundo** — leitura linear de uma seção do início ao fim
3. **Consulta recorrente** — verificar um detalhe já conhecido (field name, trigger, endpoint)

O design deve servir bem a todos os três sem sacrificar nenhum.

## Product Purpose

Living technical specification for the 5impl.is automation platform: 41 orchestrated agents, multi-tenant SaaS, Brazilian market. Covers architecture (C4 diagrams), agent catalog, database schemas, operational flows, integrations, and provisioning scripts. Success means the spec is the unambiguous source of truth — anyone reading it can understand how the system is built, how to operate it, and where to go next.

## Brand Personality

Modern, technical, ambitious — and calm, precise. The platform is serious engineering. The docs should reflect a team that knows exactly what they've built and can explain it with precision. Confident and clear — not aggressive, not soft. The ambition is in the architecture, not the decoration.

## Anti-references

- Generic dev-docs (ReadTheDocs, GitBook defaults): flat, templatey, no personality — looks like nobody cared about the presentation
- Hacker / terminal aesthetic: green-on-black, ASCII-heavy, retro CLI — too on-the-nose, wrong register for client-facing material
- Corporate enterprise docs (Confluence, SharePoint): gray, sterile, zero energy — communicates bureaucracy, not craft

## Design Principles

1. **Technical precision over visual drama.** The content is architecturally dense. Design reduces cognitive load — it doesn't add its own noise.
2. **Confidence through restraint.** Ambitious brands don't need to shout. Quiet, deliberate choices (tight spacing, careful hierarchy, one well-used accent) signal more competence than decorative flourish.
3. **Every visual choice earns its place.** Color, weight, scale — each should serve comprehension or navigation, not decoration. If it doesn't help the reader, remove it.
4. **Bilingual without compromise.** Portuguese is the default; English is the mirror. Typography, spacing, and line lengths must hold in both.
5. **Client-ready at every scroll position.** B2B clients are reading this as part of an evaluation. Every page should reinforce competence and craft, not undermine it with visual inconsistency or unclear hierarchy.
6. **Distraction-free scanning over expressive decoration.** Motion and color intensity must not compete with content retrieval. Every non-content visual element must justify its cost in attention — if it doesn't serve navigation or comprehension, it is removed, not styled.

## Accessibility & Inclusion

WCAG 2.1 AA. Text contrast ≥4.5:1, large text ≥3:1. Full keyboard navigation (Starlight handles most of this). Support for reduced motion. Bilingual (pt-BR default, en mirror).
