-- ═══════════════════════════════════════════════════════════════
-- CIO India — Complete Schema Setup
-- Schema: cio_india
--
-- Reference-only. This project uses Sanity for content; this SQL is
-- kept for when / if the Supabase side is wired up (contacts form,
-- admin whitelist, anything that doesn't live in the CMS).
-- ═══════════════════════════════════════════════════════════════
--
-- ⚠️  SAFETY: This script ONLY creates objects inside the
--     `cio_india` schema. It does NOT touch `public` or
--     `healthcare` schemas in any way.
--
-- HOW TO RUN:
--   1. Open your Supabase project dashboard
--   2. Go to SQL Editor
--   3. Paste this entire file
--   4. Click "Run"
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Create the schema ────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS cio_india;

-- Expose the schema to PostgREST (required for Supabase client to access it)
-- NOTE: Do NOT use ALTER DATABASE SET search_path — it overrides globally and
-- breaks other projects sharing the same Supabase instance (e.g. CIO Mogul).
-- Each client must specify its schema explicitly via db: { schema: '...' }.

-- Also grant usage to the Supabase roles so RLS + API work
GRANT USAGE ON SCHEMA cio_india TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA cio_india TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA cio_india GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- ─── 2. Admin Whitelist ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.admin_whitelist (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  role          TEXT NOT NULL DEFAULT 'editor',
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- ─── 3. Magazines ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.magazines (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at     TIMESTAMPTZ,
  title          TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description    TEXT,
  cover_image    TEXT,
  thumbnail_url  TEXT,
  pdf_url        TEXT,
  category       TEXT,
  publish_date   DATE,
  is_featured    BOOLEAN DEFAULT false,
  is_hall_of_fame BOOLEAN DEFAULT false,
  is_trending    BOOLEAN DEFAULT false,
  is_spotlight   BOOLEAN DEFAULT false,
  display_order  INTEGER DEFAULT 0,
  base_views     INTEGER DEFAULT 0
);

-- ─── 4. Article Categories ──────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.article_categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE
);

-- ─── 5. Articles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at       TIMESTAMPTZ,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  excerpt          TEXT,
  content          TEXT,
  cover_image      TEXT,
  author           TEXT,
  is_published     BOOLEAN DEFAULT false,
  is_featured      BOOLEAN DEFAULT false,
  publish_date     DATE DEFAULT CURRENT_DATE,
  read_time        TEXT,
  meta_title       TEXT,
  meta_description TEXT
);

-- ─── 6. Podcasts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.podcasts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at    TIMESTAMPTZ,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  youtube_url   TEXT NOT NULL,
  thumbnail_url TEXT,
  category      TEXT,
  is_featured   BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  publish_date  DATE DEFAULT CURRENT_DATE,
  duration      TEXT
);

-- ─── 7. Testimonials ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  name          TEXT NOT NULL,
  quote         TEXT NOT NULL,
  title         TEXT,
  company       TEXT,
  avatar_url    TEXT,
  is_featured   BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- ─── 8. Featured Brands ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.featured_brands (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  name          TEXT NOT NULL,
  logo_url      TEXT,
  website_url   TEXT,
  display_order INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true
);

-- ─── 9. Women Spotlight ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.women_spotlight (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT,
  slug          TEXT UNIQUE,
  variant       TEXT DEFAULT 'primary',
  display_order INTEGER,
  is_active     BOOLEAN DEFAULT true
);

-- ─── 10. Hall of Fame ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.hall_of_fame (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  slot_number INTEGER NOT NULL UNIQUE,
  magazine_id UUID REFERENCES cio_india.magazines(id) ON DELETE SET NULL
);

-- ─── 11. Contact Submissions ────────────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  first_name  TEXT,
  last_name   TEXT,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT,
  status      TEXT DEFAULT 'new'
);

-- ─── 12. Site Settings (singleton) ──────────────────────────
CREATE TABLE IF NOT EXISTS cio_india.site_settings (
  id            BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at    TIMESTAMPTZ,
  site_name     TEXT DEFAULT 'CIO India',
  tagline       TEXT,
  contact_email TEXT,
  social_links  JSONB,
  home_stats    JSONB
);

-- Insert default settings row
INSERT INTO cio_india.site_settings (site_name, tagline)
VALUES ('CIO India', 'India''s Premier CIO Platform')
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE cio_india.admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.featured_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.women_spotlight ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.hall_of_fame ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cio_india.site_settings ENABLE ROW LEVEL SECURITY;

-- ─── Admin Whitelist Policies ────────────────────────────────
-- Admins can only read their own row
CREATE POLICY "Admins can read own whitelist entry"
  ON cio_india.admin_whitelist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── Magazines Policies ─────────────────────────────────────
CREATE POLICY "Public can read magazines"
  ON cio_india.magazines FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert magazines"
  ON cio_india.magazines FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update magazines"
  ON cio_india.magazines FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete magazines"
  ON cio_india.magazines FOR DELETE
  TO authenticated
  USING (true);

-- ─── Article Categories Policies ────────────────────────────
CREATE POLICY "Public can read article categories"
  ON cio_india.article_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage article categories"
  ON cio_india.article_categories FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Articles Policies ──────────────────────────────────────
CREATE POLICY "Public can read published articles"
  ON cio_india.articles FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Authenticated users can read all articles"
  ON cio_india.articles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert articles"
  ON cio_india.articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON cio_india.articles FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete articles"
  ON cio_india.articles FOR DELETE
  TO authenticated
  USING (true);

-- ─── Podcasts Policies ──────────────────────────────────────
CREATE POLICY "Public can read podcasts"
  ON cio_india.podcasts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage podcasts"
  ON cio_india.podcasts FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Testimonials Policies ──────────────────────────────────
CREATE POLICY "Public can read testimonials"
  ON cio_india.testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON cio_india.testimonials FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Featured Brands Policies ───────────────────────────────
CREATE POLICY "Public can read featured brands"
  ON cio_india.featured_brands FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage featured brands"
  ON cio_india.featured_brands FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Women Spotlight Policies ───────────────────────────────
CREATE POLICY "Public can read women spotlight"
  ON cio_india.women_spotlight FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage women spotlight"
  ON cio_india.women_spotlight FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Hall of Fame Policies ──────────────────────────────────
CREATE POLICY "Public can read hall of fame"
  ON cio_india.hall_of_fame FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage hall of fame"
  ON cio_india.hall_of_fame FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Contacts Policies ──────────────────────────────────────
-- Public can INSERT (contact form submissions)
CREATE POLICY "Public can submit contact forms"
  ON cio_india.contacts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admins can read contacts
CREATE POLICY "Authenticated users can read contacts"
  ON cio_india.contacts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admins can update status
CREATE POLICY "Authenticated users can update contacts"
  ON cio_india.contacts FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Site Settings Policies ─────────────────────────────────
CREATE POLICY "Public can read site settings"
  ON cio_india.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update site settings"
  ON cio_india.site_settings FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);


-- ═══════════════════════════════════════════════════════════════
-- EXPOSE SCHEMA TO POSTGREST API
-- ═══════════════════════════════════════════════════════════════
-- Add cio_india to the exposed schemas in your Supabase project:
--   Dashboard → Settings → API → Exposed Schemas → add "cio_india"
--
-- OR run this notification reminder (the actual config change
-- must be done via the Supabase Dashboard UI):
NOTIFY pgrst, 'reload config';

-- ═══════════════════════════════════════════════════════════════
-- DONE! 🎉
-- ═══════════════════════════════════════════════════════════════
--
-- NEXT STEPS (manual, in Supabase Dashboard):
-- 1. Go to Settings → API → Exposed Schemas → add "cio_india"
-- 2. Create these Storage Buckets (all public):
--    • magazine-covers
--    • magazine-pdfs
--    • article-covers
--    • podcast-thumbnails
--    • spotlight-images
--    • brand-logos
--    • testimonial-avatars
-- 3. Add your .env.local:
--    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
-- ═══════════════════════════════════════════════════════════════
