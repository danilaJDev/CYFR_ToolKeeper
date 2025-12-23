insert into public.organizations (id, name, created_by)
values ('11111111-1111-1111-1111-111111111111', 'Acme Tools', '00000000-0000-0000-0000-000000000000')
on conflict do nothing;

insert into public.profiles (id, full_name, org_id, organization_id, default_organization_id, role)
values (
  '00000000-0000-0000-0000-000000000000',
  'Demo User',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'owner'
)
on conflict do nothing;

insert into public.organization_members (organization_id, user_id, role)
values ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'owner')
on conflict do nothing;

insert into public.locations (id, organization_id, name, description)
values
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Warehouse', 'Main warehouse'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Site A', 'Project site A')
on conflict do nothing;

insert into public.assets (id, organization_id, name, type, brand, model, serial_number, inventory_number, status, current_location_id)
values
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Hammer Drill', 'Power Tool', 'Bosch', 'X100', 'SN123', 'INV-001', 'InStock', '22222222-2222-2222-2222-222222222222'),
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Laser Level', 'Measuring', 'DeWalt', 'L200', 'SN987', 'INV-002', 'Issued', '33333333-3333-3333-3333-333333333333')
on conflict do nothing;

insert into public.asset_transfers (organization_id, asset_id, type, from_location_id, to_location_id, quantity, note, created_by)
values
  ('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'ISSUE', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 1, 'Issued to foreman', '00000000-0000-0000-0000-000000000000')
on conflict do nothing;
