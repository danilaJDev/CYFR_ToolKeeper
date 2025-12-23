-- Extensions
create extension if not exists "uuid-ossp";

-- Tables
create table if not exists public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  org_id uuid references public.organizations(id),
  default_organization_id uuid references public.organizations(id),
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique(organization_id, user_id)
);

create table if not exists public.locations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  type text,
  brand text,
  model text,
  serial_number text,
  inventory_number text,
  status text not null default 'InStock' check (status in ('InStock','Issued','Maintenance','WrittenOff')),
  photo_url text,
  current_location_id uuid references public.locations(id),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.asset_transfers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  type text not null check (type in ('ISSUE','RETURN','MOVE','WRITE_OFF','MAINTENANCE')),
  from_location_id uuid references public.locations(id),
  to_location_id uuid references public.locations(id),
  issued_to_user_id uuid references auth.users(id),
  quantity integer not null default 1,
  note text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.asset_audit_log (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  asset_id uuid not null,
  action text not null,
  metadata jsonb,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_assets_org on public.assets(organization_id);
create index if not exists idx_assets_status on public.assets(status);
create index if not exists idx_locations_org on public.locations(organization_id);
create index if not exists idx_transfers_org on public.asset_transfers(organization_id);
create index if not exists idx_audit_org on public.asset_audit_log(organization_id);

-- RLS
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.locations enable row level security;
alter table public.assets enable row level security;
alter table public.asset_transfers enable row level security;
alter table public.asset_audit_log enable row level security;

create policy "Users can see their orgs" on public.organizations
  for select using (exists (select 1 from public.organization_members m where m.organization_id = id and m.user_id = auth.uid()));

create policy "Users update their orgs" on public.organizations
  for update using (exists (select 1 from public.organization_members m where m.organization_id = id and m.user_id = auth.uid() and m.role in ('owner','admin')));

create policy "Read own profile" on public.profiles for select using (id = auth.uid());
create policy "Update own profile" on public.profiles for update using (id = auth.uid());

create policy "Membership select" on public.organization_members
  for select using (organization_id in (select organization_id from public.organization_members where user_id = auth.uid()));

create policy "Membership insert self" on public.organization_members
  for insert with check (user_id = auth.uid());

create policy "Membership update" on public.organization_members
  for update using (organization_id in (select organization_id from public.organization_members where user_id = auth.uid() and role in ('owner','admin')));

create policy "Locations select" on public.locations
  for select using (exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid()));

create policy "Locations modify" on public.locations
  for all using (exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid() and m.role in ('owner','admin')));

create policy "Assets select" on public.assets
  for select using (exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid()));

create policy "Assets modify" on public.assets
  for all using (exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid() and m.role in ('owner','admin')));

create policy "Transfers select" on public.asset_transfers
  for select using (exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid()));

create policy "Transfers insert" on public.asset_transfers
  for insert with check (exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid() and m.role in ('owner','admin','member')));

create policy "Audit select" on public.asset_audit_log
  for select using (exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid()));

-- Transfer trigger ensures status/location consistency
create or replace function public.handle_asset_transfer()
returns trigger as $$
declare
  current_asset public.assets;
  new_status text;
begin
  select * into current_asset from public.assets where id = new.asset_id;
  if current_asset.organization_id != new.organization_id then
    raise exception 'Organization mismatch';
  end if;

  if new.type = 'ISSUE' and current_asset.status in ('Issued','WrittenOff') then
    raise exception 'Cannot issue already issued or written-off asset';
  end if;
  if new.type = 'RETURN' and current_asset.status <> 'Issued' then
    raise exception 'Cannot return non-issued asset';
  end if;

  new_status := case new.type
    when 'ISSUE' then 'Issued'
    when 'RETURN' then 'InStock'
    when 'MAINTENANCE' then 'Maintenance'
    when 'WRITE_OFF' then 'WrittenOff'
    else current_asset.status
  end;

  update public.assets
    set current_location_id = coalesce(new.to_location_id, current_asset.current_location_id),
        status = new_status
    where id = new.asset_id;

  insert into public.asset_audit_log(organization_id, asset_id, action, metadata, created_by)
  values (new.organization_id, new.asset_id, 'TRANSFER_' || new.type, to_jsonb(new), new.created_by);

  return new;
end;
$$ language plpgsql;

create or replace trigger trg_handle_asset_transfer
after insert on public.asset_transfers
for each row execute function public.handle_asset_transfer();
