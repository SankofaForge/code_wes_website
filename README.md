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
| `src/data/site.ts` | club links and the typed name line |
| `src/app/` | pages: home, members, a member, join, 404 |
| `src/components/BoardMerge.tsx` | the board drawing on the home page |
| `src/engine/`, `src/motion/` | GSAP setup, page transitions and every motion timing |
| `DESIGN.md` | the design reasoning, palette, type and layout plan |

## Photos

Member photos and text belong to the members who provided them. The 2026 board's come from the club's "meet the board" post.
