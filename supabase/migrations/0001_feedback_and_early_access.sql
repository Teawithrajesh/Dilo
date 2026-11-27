-- DILO: feedback + early-access list (Option B, before real accounts).
-- People can ONLY add rows. Nobody can read, change or delete them through the app's public key.
-- The founder reads them in the Supabase dashboard.

create table public.feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  rating smallint check (rating between 0 and 5),
  kind text not null check (kind in ('idea', 'problem', 'liked', 'other')),
  message text not null check (char_length(message) between 1 and 1000),
  name text check (char_length(name) <= 60),
  contact text check (char_length(contact) <= 80),
  source text not null default 'demo' check (char_length(source) <= 20)
);

create table public.early_access (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  name text check (char_length(name) <= 60),
  city text check (char_length(city) <= 60),
  consent boolean not null check (consent = true),
  consent_text_version text not null default 'v1' check (char_length(consent_text_version) <= 10)
);
-- One entry per email (case-insensitive).
create unique index early_access_email_unique on public.early_access (lower(email));

alter table public.feedback enable row level security;
alter table public.early_access enable row level security;

-- Insert-only for visitors. No select/update/delete policies = no reading or changing.
create policy "anyone can send feedback" on public.feedback for insert to anon, authenticated with check (true);
create policy "anyone can join early access" on public.early_access for insert to anon, authenticated with check (consent = true);

-- Belt and braces: remove broad grants, then allow only INSERT on these two tables.
revoke all on public.feedback, public.early_access from anon, authenticated;
grant insert (rating, kind, message, name, contact, source) on public.feedback to anon, authenticated;
grant insert (email, name, city, consent, consent_text_version) on public.early_access to anon, authenticated;
