-- Run this entire file in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 role text not null default 'customer' check (role in ('customer','admin')),
 created_at timestamptz not null default now()
);
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,role) values(new.id,'customer') on conflict(id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists public.properties (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, listing_type text not null check(listing_type in ('Buy','Rent')),
 property_type text not null, price numeric not null check(price>0),
 locality text not null, address text not null, bhk integer, area_sqft numeric,
 description text, phone text not null, images text[] not null default '{}',
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 created_at timestamptz not null default now()
);
create table if not exists public.enquiries (
 id uuid primary key default gen_random_uuid(),
 property_id uuid not null references public.properties(id) on delete cascade,
 name text not null, phone text not null, email text, message text,
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.enquiries enable row level security;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='admin'); $$;

create policy "profiles read own or admin" on public.profiles for select to authenticated using(id=auth.uid() or public.is_admin());
create policy "approved properties public read" on public.properties for select using(status='approved' or user_id=auth.uid() or public.is_admin());
create policy "customers create own properties" on public.properties for insert to authenticated with check(user_id=auth.uid() and status='pending');
-- Only admins can change listing records/status after submission; this prevents users approving their own listings.
create policy "admin update properties" on public.properties for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "owner delete or admin" on public.properties for delete to authenticated using(user_id=auth.uid() or public.is_admin());
create policy "anyone can submit enquiry" on public.enquiries for insert with check(true);
create policy "admin read enquiries" on public.enquiries for select to authenticated using(public.is_admin());

-- Create a PUBLIC storage bucket named property-photos in Storage UI, then add policies below.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('property-photos','property-photos',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true;
create policy "Public can view property photos" on storage.objects for select using(bucket_id='property-photos');
create policy "Logged in users upload to own folder" on storage.objects for insert to authenticated
with check(bucket_id='property-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Users delete own photos" on storage.objects for delete to authenticated
using(bucket_id='property-photos' and (storage.foldername(name))[1]=auth.uid()::text);
