create extension if not exists pgcrypto;

create table if not exists public.lights (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now(),
  status text not null default 'visible',
  constraint lights_latitude_range check (latitude between -90 and 90),
  constraint lights_longitude_range check (longitude between -180 and 180),
  constraint lights_word_reasonable_length check (char_length(word) between 1 and 96),
  constraint lights_status_values check (status in ('visible', 'hidden'))
);

create index if not exists lights_visible_created_at_idx
  on public.lights (created_at desc, id desc)
  where status = 'visible';

alter table public.lights enable row level security;
revoke all on table public.lights from anon, authenticated;

comment on table public.lights is
  'Public words and manually selected approximate coordinates. Access is mediated by server API routes.';
