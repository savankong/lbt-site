-- Run this in your Supabase SQL editor to set up the database

-- Episodes table
create table if not exists episodes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  series text not null check (series in ('life-between-titles', 'work-unscripted', 'office-hours')),
  episode_number integer not null,
  guest_name text not null,
  guest_title text not null default '',
  guest_bio text not null default '',
  guest_field_explainer text not null default '',
  episode_title text not null,
  meta_description text not null default '',
  summary text not null default '',
  key_topics jsonb not null default '[]',
  pull_quote text not null default '',
  qa_excerpts jsonb not null default '[]',
  career_path text not null default '',
  what_makes_different text not null default '',
  story_bullets jsonb not null default '[]',
  chapters jsonb not null default '[]',
  youtube_url text not null default '',
  spotify_url text not null default '',
  apple_url text not null default '',
  guest_image_url text not null default '',
  thumbnail_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger episodes_updated_at
  before update on episodes
  for each row execute function update_updated_at();

-- Sponsor submissions
create table if not exists sponsor_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  website text,
  budget_range text,
  message text,
  created_at timestamptz not null default now()
);

-- Guest submissions
create table if not exists guest_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  email text not null,
  linkedin_url text,
  transition_story text not null,
  why_lbt text,
  created_at timestamptz not null default now()
);

-- Storage bucket for images
insert into storage.buckets (id, name, public)
values ('episode-images', 'episode-images', true)
on conflict do nothing;

-- Public read policy for episode images
create policy "Public read episode images"
  on storage.objects for select
  using (bucket_id = 'episode-images');

-- Indexes
create index if not exists episodes_status_idx on episodes (status);
create index if not exists episodes_series_idx on episodes (series);
create index if not exists episodes_slug_idx on episodes (slug);
create index if not exists episodes_published_at_idx on episodes (published_at desc);
