-- Supabase schema for ToolKeeper
-- Generated from application code (Next.js + Supabase). Run in the SQL editor.

-- Extensions
create extension if not exists "pgcrypto";

-- Helper function to keep updated_at current
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- Locations
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text,
  created_at timestamptz default timezone('utc', now())
);

-- Assets inventory
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text default 'В работе',
  owner text,
  serial_number text,
  location_id uuid references public.locations(id) on delete set null,
  location_name text,
  note text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);
create trigger update_assets_updated_at
  before update on public.assets
  for each row execute function public.set_updated_at();

-- Transfers / shipments between locations
create table if not exists public.transfers (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets(id) on delete set null,
  asset_name text not null,
  from_location text,
  to_location text,
  status text default 'В пути',
  eta text,
  note text,
  created_at timestamptz default timezone('utc', now())
);

-- Team members and readiness
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text,
  presence text,
  created_at timestamptz default timezone('utc', now())
);

-- Maintenance jobs / service tasks
create table if not exists public.maintenance_jobs (
  id uuid primary key default gen_random_uuid(),
  asset_name text not null,
  status text,
  progress int check (progress between 0 and 100),
  created_at timestamptz default timezone('utc', now())
);

-- Per-user settings (links to Supabase auth.users)
create table if not exists public.settings (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text,
  warehouse_name text,
  notify_receipts boolean not null default false,
  notify_service boolean not null default false,
  updated_at timestamptz default timezone('utc', now())
);
create trigger update_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- Recommended indexes
create index if not exists idx_assets_name on public.assets using gin (to_tsvector('russian', coalesce(name,'')));
create index if not exists idx_transfers_created_at on public.transfers (created_at desc);
create index if not exists idx_maintenance_progress on public.maintenance_jobs (progress desc);

-- RLS policies (authenticated users only)
alter table public.locations enable row level security;
alter table public.assets enable row level security;
alter table public.transfers enable row level security;
alter table public.team_members enable row level security;
alter table public.maintenance_jobs enable row level security;
alter table public.settings enable row level security;

-- Generic authenticated policies for shared tables
create policy "locations_auth_rw" on public.locations
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "assets_auth_rw" on public.assets
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "transfers_auth_rw" on public.transfers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "team_members_auth_rw" on public.team_members
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "maintenance_auth_rw" on public.maintenance_jobs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Settings are scoped to the current user
create policy "settings_self_access" on public.settings
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Allow service role full control (optional but common for Supabase)
grant all on all tables in schema public to service_role;

