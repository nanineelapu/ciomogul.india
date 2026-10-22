# Reference material

Files in this folder are **not used by the running app**. They're kept
in-repo so decisions, prior art, and provisioning scripts stay with the
codebase.

## supabase-schema.sql

Full `cio_india` schema (tables + RLS policies + storage-bucket notes)
for the companion Supabase project. The CIO Mogul India site uses
**Sanity** for content, so this SQL is reference-only. Use it when:

- The client wants to wire up the Supabase side (e.g. contact-form
  submissions → `contacts` table, admin whitelist → `admin_whitelist`).
- Someone needs to recreate the schema from scratch.

Important notes carried over from the original file:

- The script is **scoped to `cio_india`** — it never touches `public`
  or `healthcare` schemas.
- Clients must pass `db: { schema: 'cio_india' }` explicitly. Do **not**
  `ALTER DATABASE SET search_path` — it would break every other project
  sharing the Supabase instance.
- `cio_india` must be added to **Settings → API → Exposed Schemas**
  via the Supabase Dashboard before PostgREST can reach it.
- 7 public storage buckets listed at the bottom of the file have to be
  created manually in the Dashboard.
