-- CYFR ToolKeeper — Supabase bootstrap
-- Run this SQL in the Supabase SQL editor to provision all tables, indexes and RLS policies
-- used by the Next.js application.

-- Extensions --------------------------------------------------------------
create extension if not exists "pgcrypto";  -- uuid generation
create extension if not exists "pg_trgm";   -- faster ILIKE searches

-- Helper function to keep updated_at current
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- Locations ---------------------------------------------------------------
create table if not exists public.locations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  type        text,
  created_at  timestamptz default timezone('utc', now())
);

-- Assets inventory --------------------------------------------------------
create table if not exists public.assets (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  status         text default 'В работе',
  owner          text,
  serial_number  text,
  location_id    uuid references public.locations(id) on delete set null,
  location_name  text,
  note           text,
  created_at     timestamptz default timezone('utc', now()),
  updated_at     timestamptz default timezone('utc', now())
);
create trigger update_assets_updated_at
  before update on public.assets
  for each row execute function public.set_updated_at();

-- Transfers / shipments between locations --------------------------------
create table if not exists public.transfers (
  id            uuid primary key default gen_random_uuid(),
  asset_id      uuid references public.assets(id) on delete set null,
  asset_name    text not null,
  from_location text,
  to_location   text,
  status        text default 'В пути',
  eta           text,
  note          text,
  created_at    timestamptz default timezone('utc', now())
);

-- Team members and readiness ---------------------------------------------
create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  role       text,
  presence   text,
  created_at timestamptz default timezone('utc', now())
);

-- Maintenance jobs / service tasks ---------------------------------------
create table if not exists public.maintenance_jobs (
  id         uuid primary key default gen_random_uuid(),
  asset_name text not null,
  status     text,
  progress   int check (progress between 0 and 100),
  created_at timestamptz default timezone('utc', now())
);

-- Per-user settings (links to Supabase auth.users) ------------------------
create table if not exists public.settings (
  id               uuid primary key references auth.users(id) on delete cascade,
  company_name     text,
  warehouse_name   text,
  notify_receipts  boolean not null default false,
  notify_service   boolean not null default false,
  updated_at       timestamptz default timezone('utc', now())
);
create trigger update_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- Recommended indexes -----------------------------------------------------
create index if not exists idx_assets_name_trgm on public.assets using gin (name gin_trgm_ops);
create index if not exists idx_assets_location on public.assets (location_name);
create index if not exists idx_transfers_created_at on public.transfers (created_at desc);
create index if not exists idx_team_members_name on public.team_members using gin (full_name gin_trgm_ops);
create index if not exists idx_maintenance_progress on public.maintenance_jobs (progress desc);

-- Row Level Security policies --------------------------------------------
alter table public.locations        enable row level security;
alter table public.assets           enable row level security;
alter table public.transfers        enable row level security;
alter table public.team_members     enable row level security;
alter table public.maintenance_jobs enable row level security;
alter table public.settings         enable row level security;

-- Generic authenticated policies (read/write for team members) -----------
create policy "locations_auth_rw" on public.locations
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "assets_auth_rw" on public.assets
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "transfers_auth_rw" on public.transfers
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "team_members_auth_rw" on public.team_members
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "maintenance_auth_rw" on public.maintenance_jobs
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Settings are scoped to the current user --------------------------------
create policy "settings_self_access" on public.settings
  for all using (auth.uid() = id)
  with check (auth.uid() = id);

-- Optional: allow the service role to manage everything -------------------
grant all on all tables in schema public to service_role;

-- Expose select privileges for authenticated users (RLS still applies)
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.locations        to authenticated;
grant select, insert, update, delete on public.assets           to authenticated;
grant select, insert, update, delete on public.transfers        to authenticated;
grant select, insert, update, delete on public.team_members     to authenticated;
grant select, insert, update, delete on public.maintenance_jobs to authenticated;
grant select, insert, update, delete on public.settings         to authenticated;
