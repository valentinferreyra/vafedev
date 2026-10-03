# vafedev.me V1 Design

## Purpose

`vafedev.me` is Valentín Ferreyra's personal developer website. Its primary job is to help a visitor quickly understand that Valentín is a software developer, who he is today, the work he has done, how his career has evolved, and which important technical decisions contributed to meaningful outcomes.

The site should feel personal and technically credible without resembling a generic portfolio. It takes inspiration from the restraint and readability of `flaviocopes.com`, while using its own layout, navigation, color system, and content model.

## V1 Scope

The first version is entirely in English. It contains the following primary navigation in this exact order:

1. Home
2. About
3. Timeline
4. Projects
5. Learning
6. Designs

Secondary navigation contains:

1. Blog
2. Goals
3. Skills
4. Tools
5. Books

The V1 does not include authentication, a database, a CMS, comments, analytics dashboards, advanced collection filters, or multilingual controls. The architecture should not prevent a future Spanish version, but no language-switching UI or duplicate content is included now.

## Information Architecture

### Home

Home is the concise overview of Valentín today. It introduces his identity and professional focus, then offers selected milestones and one featured architecture or design decision. It should provide enough context to understand his profile while making deeper sections optional.

### About

About tells the broader personal and professional story. It is more narrative than a résumé and explains motivations, values, working style, and current direction.

### Timeline

Timeline presents the professional journey chronologically. Entries may link to related projects, learning notes, and design decisions.

### Projects

Projects covers both personal work and projects in which Valentín played a meaningful role. Each entry explains the context, his responsibility, the work performed, important constraints, and the outcome.

### Learning

Learning documents professional growth with evidence. It includes design patterns, programming languages, frameworks, testing approaches, infrastructure concepts, and other technical lessons.

Each learning entry should answer:

- What was learned?
- Where was it applied?
- What problem did it help solve?
- What was the practical takeaway?
- What would be done differently today?

Learning is distinct from Skills. Skills is a concise inventory of present capabilities; Learning explains how knowledge was acquired and applied.

### Designs

Designs records substantial software architecture and engineering decisions. Entries explain context, alternatives, trade-offs, the selected approach, outcomes, and lessons. A design may link to the project where it was implemented and the learning it produced.

### Secondary sections

- Blog contains long-form writing.
- Goals records current, future, and completed objectives.
- Skills provides a concise view of current capabilities.
- Tools lists preferred development tools and explains why they are useful.
- Books records books read, in progress, or planned.

## Cross-linking Model

Content should form a connected professional narrative rather than isolated lists. Projects, Learning, Designs, and Timeline entries may reference one another. For example, a project can link to an architecture decision and the learning produced by that decision. Related content is explicit metadata, not automatically inferred from prose.

## Page Patterns

The site uses three consistent page patterns.

### Profile pages

Home, About, and Timeline use broad narrative layouts. Home is concise, About is long-form, and Timeline is chronological.

### Collection pages

Projects, Learning, Designs, Blog, Goals, Skills, Tools, and Books provide readable indexes of their entries. V1 avoids advanced filtering while collections remain small. Empty collections are omitted from navigation rather than presented as unfinished pages.

### Detail pages

Projects, Learning, Designs, and Blog entries have dedicated URLs. Project, Learning, and Design detail pages adapt the following shared narrative structure where relevant:

1. Context
2. Problem or motivation
3. What I did or learned
4. Decisions and trade-offs
5. Outcome
6. What I would change today
7. Related content

The structure is a writing guide rather than a requirement to render empty headings. Sections without meaningful content are omitted.

## Visual Direction

The approved direction is a restrained technical notebook with a persistent, structured index inspired by the information density of developer tools without copying their appearance.

### Layout

- Desktop uses a 300px left sidebar and a spacious content column.
- The sidebar remains visible while the content scrolls.
- Navigation is organized into primary and secondary groups.
- Groups expand and collapse independently; multiple groups may remain open.
- The current route receives a subtle active treatment.
- Mobile replaces the persistent sidebar with a compact header and an Index control that opens the navigation as a side panel.

### Typography

- IBM Plex Sans is used for headings and body content.
- Geist Mono is used for navigation, paths, labels, dates, tags, and metadata.
- Text should be comfortably sized with generous line height and restrained line length.
- The hierarchy relies on scale, spacing, and weight rather than decorative effects.

### Color: Mineral Mist

Light mode is the visual default. It uses a cool gray/off-white foundation, dark graphite text, muted teal accents, and extremely soft teal and warm-beige atmospheric gradients. The gradient should make the background feel less dry without drawing attention away from the content.

Dark mode uses a deep blue-graphite foundation rather than pure black, soft ivory text, muted teal accents, and restrained teal and warm-brown atmospheric gradients.

Both themes must meet accessible text and control contrast. Color is not the sole indicator for navigation state or interaction.

### Theme behavior

- A compact Light/Dark control sits at the bottom of the sidebar and remains available in the mobile navigation panel.
- A visitor without a saved preference always starts in light mode, regardless of the operating-system theme.
- A manual theme choice is stored locally and restored on later page loads and future visits.
- Selecting light mode updates the stored preference in the same way as selecting dark mode.
- Theme initialization must avoid a visible incorrect-theme flash.

### Motion

Motion is limited to useful transitions: expanding navigation groups, opening the mobile panel, changing theme, and subtle interactive feedback. The site respects `prefers-reduced-motion` and remains fully understandable without animation.

## Content Source

Content lives in the Git repository as Markdown or MDX. Separate collections cover projects, learning, designs, blog posts, goals, and books. About, Timeline, Skills, and Tools may start as simpler structured content when a full collection provides no benefit.

Every collection entry has a typed metadata contract appropriate to its section. Shared metadata includes a slug, title, summary, publication or event date when relevant, status when relevant, and explicit related-content references. Invalid metadata or broken internal references should fail validation during development or build rather than silently render incomplete pages.

MDX may use a small approved set of presentation components, such as callouts, code blocks, figures, and related-content links. Arbitrary per-article layouts are outside V1 so the visual system stays consistent.

## Technical Architecture

- Use the existing Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, and pnpm scaffold.
- Prefer statically generated pages for public content.
- Keep content processing local to the repository; V1 has no database or remote CMS dependency.
- Keep navigation, content loading, theme preference, and metadata generation as separate responsibilities.
- Use reusable layout and content primitives rather than creating unrelated page-specific visual systems.
- Follow the exact APIs and conventions documented in the installed Next.js version before implementation.
- Deploy to Vercel and connect both `vafedev.me` and the chosen canonical host configuration.

## Metadata and Discovery

V1 includes:

- Per-page title and description metadata
- Canonical URLs
- Open Graph and social sharing metadata
- Sitemap generation
- `robots.txt`
- An RSS feed for Blog entries
- A consistent not-found page using the same visual language

## Accessibility and Responsive Behavior

- All navigation and theme controls are keyboard operable.
- Focus is clearly visible in both themes.
- Semantic landmarks and heading order describe the page structure.
- The mobile navigation panel manages focus appropriately and can be dismissed without a pointer.
- Text and controls maintain readable sizing from 320px upward.
- Both themes maintain accessible contrast.
- Reduced-motion preferences are honored.

## Failure and Empty States

- Invalid MDX metadata, duplicate slugs, or broken related-content references fail validation.
- Missing optional content is omitted without leaving empty labels or sections.
- Empty collections are hidden from navigation until they contain publishable content.
- Unknown routes render the custom not-found page.
- Theme storage failures fall back safely to light mode and do not prevent navigation or content rendering.

## Verification Strategy

Verification should cover:

- Content schema validation and unique slugs
- Generated collection and detail routes
- Related-content reference integrity
- Primary and secondary navigation behavior
- Sidebar expansion and mobile navigation
- Light mode as the first-visit default
- Persistence of a manual theme choice
- No incorrect-theme flash during initialization
- Keyboard navigation and visible focus
- Representative responsive layouts
- Metadata, sitemap, robots, and RSS generation
- Production build and lint checks

## V1 Success Criteria

The V1 is successful when a first-time visitor can quickly identify Valentín as a software developer, understand his present focus, and find credible evidence of his work, growth, and major technical decisions. The site should remain calm, readable, fast, and coherent across desktop and mobile, with enough structure to grow through content rather than additional interface complexity.
