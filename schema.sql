-- Review before running on an existing database. This script creates missing tables and policies.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  listing_type text not null check (listing_type in ('Buy','Rent')),
  property_type text not null,
  price numeric not null default 0,
  locality text not null,
  address text,
  bhk integer,
  area_sqft numeric,
  description text,
  phone text,
  images text[] not null default '{}',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.enquiries enable row level security;

drop policy if exists "Public can read approved properties" on public.properties;
create policy "Public can read approved properties" on public.properties for select using (status = 'approved');

drop policy if exists "Users can submit own properties" on public.properties;
create policy "Users can submit own properties" on public.properties for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Admins can read all properties" on public.properties;
create policy "Admins can read all properties" on public.properties for select to authenticated using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins can update properties" on public.properties;
create policy "Admins can update properties" on public.properties for update to authenticated using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
) with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Anyone can submit enquiry" on public.enquiries;
create policy "Anyone can submit enquiry" on public.enquiries for insert with check (true);

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries" on public.enquiries for select to authenticated using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated using (id = auth.uid());

-- Create the public storage bucket if it does not exist.
insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view property photos" on storage.objects;
create policy "Public can view property photos" on storage.objects for select using (bucket_id = 'property-photos');

drop policy if exists "Authenticated users upload property photos" on storage.objects;
create policy "Authenticated users upload property photos" on storage.objects for insert to authenticated with check (bucket_id = 'property-photos');
