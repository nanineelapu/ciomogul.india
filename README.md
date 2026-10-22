# CIO Mogul India — Next.js

The approved homepage design, rebuilt as a Next.js project ready for the backend and Sanity work.

- **Next.js** 16 · App Router
- **React** 19
- **TypeScript**
- **Tailwind CSS** v4 (design tokens live in `src/app/globals.css` under `@theme`)
- **Fonts** loaded through `next/font/google`: Playfair Display (section titles) and Poppins (everything else)
- **No external UI libraries.** Every section is a plain React component.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Where things live

```
src/
├── app/
│   ├── layout.tsx         # <html>, font setup, global metadata
│   ├── page.tsx           # homepage: renders every section in order
│   └── globals.css        # design tokens + all component styles
└── components/            # one component per section
    ├── Header.tsx         # logo row + sticky navy navigation bar
    ├── Headlines.tsx      # scrolling "Latest" bar with date
    ├── MagazineRelease.tsx
    ├── CoverStories.tsx
    ├── LatestNews.tsx     # news grid + "Vital updates" sidebar
    ├── FeaturedArticles.tsx
    ├── WallOfFame.tsx     # women leaders — profile cards
    ├── Podcasts.tsx
    ├── Testimonials.tsx
    ├── GetFeatured.tsx
    ├── Newsletter.tsx     # client-side form
    └── Footer.tsx

public/
└── assets/                # 30 real covers, podcast thumbs and headshots
```

## Design tokens

The palette and fonts are declared in one place, `globals.css`:

```css
@theme {
  --color-paper:        #FFFFFF;   /* page background */
  --color-paper-2:      #F4F6F9;   /* light panels */
  --color-ink:          #141414;   /* body text */
  --color-ink-2:        #3A3A3A;   /* secondary text */
  --color-muted:        #6B6B6B;
  --color-navy:         #0B1F3A;   /* nav bar, primary buttons, headings' rule */
  --color-navy-2:       #1B3A6B;   /* links, labels, hovers */
  --color-navy-light:   #C9D6EC;
  --font-display:       'Playfair Display', Georgia, serif;
  --font-ui:            'Poppins', ...;
}
```

Change a token and the whole site follows.

## Content

Content is **hard-coded** inside each component (headlines, dates, podcast titles, cover captions, testimonials). When Sanity is wired up, each component becomes a thin wrapper that reads the same shape from a Sanity query — see the arrays at the top of each file.

## Images

Next.js `<Image>` is used throughout. The source photos live in `public/assets/`. Nothing is hot-linked.

## What's not here yet

- `/magazines`, `/hall-of-fame`, `/women-spotlight`, `/podcasts`, `/news`, `/about`, `/contact` and `/privacy` / `/terms` pages. The nav links already point at them.
- Sanity (or any other CMS) wiring. The content arrays are ready to be swapped for queries.
- A mailing-service integration for the newsletter form. It currently just validates the email.

## Original HTML version

The HTML/CSS prototype that this project was ported from lives at `../cio-mogul-redesign/` for reference.
