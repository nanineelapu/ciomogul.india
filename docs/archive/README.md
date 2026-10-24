# Archived page code

The About and Women Spotlight pages were removed from the site so their UI can
be redesigned. Their last working code is saved here with a `.txt` ending so it
is not compiled.

To bring a page back, copy the file to its original location and delete `.txt`.

| Saved file | Original location |
|---|---|
| `about/page.tsx.txt` | `src/app/(site)/about/page.tsx` |
| `about/ExploreLinks.tsx.txt` | `src/components/shared/ExploreLinks.tsx` (still in the project) |
| `women-spotlight/page.tsx.txt` | `src/app/(site)/women-spotlight/page.tsx` |
| `women-spotlight/profile-page.tsx.txt` | `src/app/(site)/women-spotlight/[slug]/page.tsx` |
| `women-spotlight/LeaderCard.tsx.txt` | `src/components/womenSpotlight/LeaderCard.tsx` |
| `women-spotlight/LeaderFilters.tsx.txt` | `src/components/womenSpotlight/LeaderFilters.tsx` |

Still in the project and unchanged:

- The data and Sanity setup for both pages (`src/data/about.ts`, `src/data/womenLeaders.ts`,
  the `getAboutContent` and `getWomenLeaders` functions, and the Sanity schemas).
- The styles (`.about-cover`, `.ws-card`, `.ws-profile` and related rules in `globals.css`).
- The homepage "Wall of fame" strip, which does not use these pages' components.

When the Women Spotlight profile page is restored, add its links back to
`src/app/sitemap.ts`.
