alter table public.lights
  drop constraint if exists lights_word_reasonable_length;

alter table public.lights
  add constraint lights_word_length check (char_length(word) between 1 and 24),
  add constraint lights_word_single_safe_token check (
    word = btrim(word)
    and word !~ '[[:space:]<>[:cntrl:]]'
  );

alter table public.lights enable row level security;
revoke all on table public.lights from anon, authenticated;
grant select (id, word, latitude, longitude, created_at, status)
  on table public.lights to anon, authenticated;

drop policy if exists "Visible lights are public" on public.lights;
create policy "Visible lights are public"
  on public.lights
  for select
  to anon, authenticated
  using (status = 'visible');

create table if not exists public.light_submission_limits (
  client_id uuid primary key,
  window_started_at timestamptz not null default now(),
  submission_count integer not null default 0,
  last_submission_at timestamptz
);

alter table public.light_submission_limits enable row level security;
revoke all on table public.light_submission_limits from anon, authenticated;

create or replace function public.create_public_light(
  p_word text,
  p_latitude double precision,
  p_longitude double precision,
  p_client_id uuid
)
returns table (
  id uuid,
  word text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  rate_row public.light_submission_limits%rowtype;
begin
  if p_word is null
    or char_length(p_word) not between 1 and 24
    or p_word <> btrim(p_word)
    or p_word ~ '[[:space:]<>[:cntrl:]]'
    or p_latitude not between -90 and 90
    or p_longitude not between -180 and 180
    or p_client_id is null then
    raise exception 'INVALID_LIGHT';
  end if;

  insert into public.light_submission_limits (client_id)
  values (p_client_id)
  on conflict (client_id) do nothing;

  select * into rate_row
  from public.light_submission_limits
  where client_id = p_client_id
  for update;

  if rate_row.last_submission_at is not null
    and rate_row.last_submission_at > now() - interval '30 seconds' then
    raise exception 'RATE_LIMIT_SHORT';
  end if;

  if rate_row.window_started_at <= now() - interval '24 hours' then
    update public.light_submission_limits
    set window_started_at = now(), submission_count = 0
    where client_id = p_client_id;
    rate_row.submission_count := 0;
  end if;

  if rate_row.submission_count >= 20 then
    raise exception 'RATE_LIMIT_DAILY';
  end if;

  update public.light_submission_limits
  set submission_count = submission_count + 1,
      last_submission_at = now()
  where client_id = p_client_id;

  return query
  insert into public.lights as created (word, latitude, longitude, status)
  values (p_word, p_latitude, p_longitude, 'visible')
  returning created.id, created.word, created.latitude, created.longitude, created.created_at;
end;
$$;

revoke all on function public.create_public_light(text, double precision, double precision, uuid) from public;
grant execute on function public.create_public_light(text, double precision, double precision, uuid) to anon, authenticated;

comment on function public.create_public_light is
  'Validates and rate-limits permanent light submissions from the static GitHub Pages client.';
