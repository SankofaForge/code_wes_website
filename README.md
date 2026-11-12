# Code_Wes website

The site for Code_Wes, Wesleyan's coding club. The home page draws the current board as branches merging into the club's main line, and every member gets a page of their own.

This branch is a redesign proposal for the board. The current site is at [code-wes-website.vercel.app](https://code-wes-website.vercel.app/).

## Add yourself

A member page is one JSON file.

1. Create `content/members/your-name.json`. The file name becomes the address: `ada-lovelace.json` is served at `/members/ada-lovelace/`.
2. Fill in `name`, `role` and `study`. Everything else is optional. [`content/member.schema.json`](content/member.schema.json) lists the fields, and editors that read JSON Schema will autocomplete them.
3. If you want a photo, put it in `public/members/` (WebP or JPEG, under 200 KB) and describe it in `alt`.
4. Open a pull request. The build reads every member file and stops with the file and field to fix.

The `/join/` page on the site walks through the same steps with a starting file.

## Add an event, a number or a syllabus

- **Event:** add `content/events/event-name.json`. [`content/events/README.md`](content/events/README.md) has a starting file. The event gets its own page and shows up on `/log`.
- **Club number:** add it to `content/stats.json` with what it counts and where the number came from. The founding year goes in `founded`, with `foundedSource`.
- **Syllabus:** add a `syllabus` to the course's file in `content/courses/`, but only for one the professor has posted publicly or agreed to share.

## Run it

Node 20.9 or newer.

```bash
npm ci
npm run dev
```

`npm run check` runs lint, the type check and the production build, the same steps CI runs on every pull request. The build is a static export in `out/`, so GitHub Pages, Vercel or any static host can serve it.

## Where things live

| Path | What it holds |
| --- | --- |
| `content/members/` | one file per member |
| `content/courses/` | one file per COMP course, drawn on the course map |
| `content/resources/` | one file per resources folder: campus, careers, learning |
| `content/events/` | one file per past event; each becomes a page and a tag on the log |
| `content/history.json`, `content/stats.json` | the club's history and the numbers at the top of the log |
| `src/data/site.ts` | club links and the typed name line |
| `src/app/` | pages: home, log, events, resources, course map, members, join, 404 |
| `src/components/BoardMerge.tsx` | the board drawing on the home page |
| `src/engine/`, `src/motion/` | GSAP setup, page transitions and every motion timing |
| `DESIGN.md` | the design reasoning, palette, type and layout plan |

## Photos

Member photos and text belong to the members who provided them. The 2026 board's come from the club's "meet the board" post.
