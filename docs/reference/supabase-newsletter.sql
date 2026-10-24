-- Newsletter subscribers. Run this in the Supabase SQL Editor after the contacts table.
-- Visitors can only add themselves; only signed-in admins (or the server's secret key)
-- can read or change the list.

create table if not exists cio_india.newsletter_subscribers (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now() not null,
  email            text not null unique,        -- stored in lower case by the site
  status           text not null default 'subscribed',  -- 'subscribed' or 'unsubscribed'
  source           text default 'website',
  unsubscribed_at  timestamptz
);

alter table cio_india.newsletter_subscribers enable row level security;

grant insert on cio_india.newsletter_subscribers to anon;
grant all on cio_india.newsletter_subscribers to authenticated, service_role;

create policy "Public can subscribe"
  on cio_india.newsletter_subscribers for insert to anon, authenticated with check (true);
create policy "Admins can read subscribers"
  on cio_india.newsletter_subscribers for select to authenticated using (true);
create policy "Admins can update subscribers"
  on cio_india.newsletter_subscribers for update to authenticated using (true) with check (true);

notify pgrst, 'reload config';
