-- ============================================================================
-- DuoDate Admin Analytics Setup Migration
-- Run this in Supabase Dashboard -> SQL Editor -> New Query
-- Safe & idempotent: does NOT alter or drop any of your existing tables.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. App Downloads & Install Attribution
-- Tracks who downloaded DuoDate, exact date & time, platform, source & device.
-- Populated by:
--   a) Website store badge clicks (/api/analytics/download)
--   b) Mobile app first-open / install telemetry (direct Supabase or API)
-- ----------------------------------------------------------------------------
create table if not exists public.app_downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references public.users(id) on delete set null,
  device_id text null,
  downloader_name text null,
  downloader_email text null,
  platform text not null default 'android'
    check (platform in ('ios', 'android', 'web', 'unknown')),
  source text not null default 'app_install'
    check (source in ('app_install', 'website_store_click', 'waitlist', 'direct')),
  app_version text null,
  os_version text null,
  device_model text null,
  country text null,
  referrer text null,
  user_agent text null,
  downloaded_at timestamptz not null default now()
);

create index if not exists idx_app_downloads_downloaded_at
  on public.app_downloads (downloaded_at desc);

create index if not exists idx_app_downloads_user_id
  on public.app_downloads (user_id);

create index if not exists idx_app_downloads_platform
  on public.app_downloads (platform);

-- ----------------------------------------------------------------------------
-- 2. User App Sessions (Time of Use Tracking)
-- Tracks session start, end/heartbeat, and duration in seconds per user.
-- Powers "Average Time of Use per User", DAU/WAU/MAU, and retention metrics.
-- ----------------------------------------------------------------------------
create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  device_id text null,
  platform text not null default 'android'
    check (platform in ('ios', 'android', 'web', 'unknown')),
  app_version text null,
  started_at timestamptz not null default now(),
  ended_at timestamptz null,
  last_heartbeat_at timestamptz not null default now(),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  screens_viewed integer not null default 1 check (screens_viewed >= 0)
);

create index if not exists idx_user_sessions_user_started
  on public.user_sessions (user_id, started_at desc);

create index if not exists idx_user_sessions_started_at
  on public.user_sessions (started_at desc);

-- Trigger to automatically compute duration_seconds when ended_at or
-- last_heartbeat_at is updated and duration_seconds wasn't explicitly set.
create or replace function public.sync_user_session_duration()
returns trigger
language plpgsql
as $$
declare
  end_ts timestamptz;
  computed_seconds integer;
begin
  end_ts := coalesce(new.ended_at, new.last_heartbeat_at, new.started_at);
  computed_seconds := greatest(0, floor(extract(epoch from (end_ts - new.started_at)))::integer);

  if new.duration_seconds is null or new.duration_seconds = 0 then
    new.duration_seconds := computed_seconds;
  elsif tg_op = 'UPDATE' and new.duration_seconds = old.duration_seconds and end_ts > coalesce(old.ended_at, old.last_heartbeat_at, old.started_at) then
    new.duration_seconds := greatest(new.duration_seconds, computed_seconds);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sync_user_session_duration on public.user_sessions;
create trigger trg_sync_user_session_duration
  before insert or update on public.user_sessions
  for each row
  execute function public.sync_user_session_duration();

-- ----------------------------------------------------------------------------
-- 3. Optional Granular Feature Events
-- Tracks screen views or feature actions (e.g., date_created, outfit_added).
-- ----------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references public.users(id) on delete set null,
  session_id uuid null references public.user_sessions(id) on delete set null,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_created_at
  on public.analytics_events (created_at desc);

create index if not exists idx_analytics_events_name
  on public.analytics_events (event_name);

-- ----------------------------------------------------------------------------
-- 4. Row Level Security (RLS)
-- Admin dashboard reads via SUPABASE_SERVICE_ROLE_KEY on the Next.js server,
-- which safely bypasses RLS. Client apps can only insert/update their own rows.
-- ----------------------------------------------------------------------------
alter table public.app_downloads enable row level security;
alter table public.user_sessions enable row level security;
alter table public.analytics_events enable row level security;

-- Mobile users can record their own install/download attribution
drop policy if exists "Users can insert own app download" on public.app_downloads;
create policy "Users can insert own app download"
  on public.app_downloads
  for insert
  to authenticated
  with check (user_id is null or auth.uid() = user_id);

-- Mobile users can create and update their own usage sessions
drop policy if exists "Users can insert own sessions" on public.user_sessions;
create policy "Users can insert own sessions"
  on public.user_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own sessions" on public.user_sessions;
create policy "Users can update own sessions"
  on public.user_sessions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can select own sessions" on public.user_sessions;
create policy "Users can select own sessions"
  on public.user_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Mobile users can insert their own analytics events
drop policy if exists "Users can insert own analytics events" on public.analytics_events;
create policy "Users can insert own analytics events"
  on public.analytics_events
  for insert
  to authenticated
  with check (user_id is null or auth.uid() = user_id);
