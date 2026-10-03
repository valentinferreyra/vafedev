# vafedev.me

Personal website for Valentín Ferreyra. The first version presents the profile, timeline, projects, learning notes, designs, blog, goals, skills, tools, and books through a quiet editorial interface.

## Local development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
pnpm test
pnpm test:e2e
pnpm lint
pnpm build
```

Content lives in `content/<collection>/*.mdx`. Draft entries are validated but remain unpublished until their frontmatter sets `draft: false`.
