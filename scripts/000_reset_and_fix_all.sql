-- Complete reset and fix for RLS policies
-- This script will drop everything and recreate with correct policies

-- Drop all existing policies
drop policy if exists "Anyone can view available properties" on public.properties;
drop policy if exists "Only admins can insert properties" on public.properties;
drop policy if exists "Only admins can update properties" on public.properties;
drop policy if exists "Only admins can delete properties" on public.properties;
drop policy if exists "Anyone can submit property leads" on public.property_leads;
drop policy if exists "Only admins can view property leads" on public.property_leads;
drop policy if exists "Anyone can submit properties" on public.property_submissions;
drop policy if exists "Only admins can view property submissions" on public.property_submissions;
drop policy if exists "Only admins can update property submissions" on public.property_submissions;
drop policy if exists "Anyone can view admin users" on public.admin_users;
drop policy if exists "Admins can view all admin users" on public.admin_users;

-- Drop existing function
drop function if exists public.is_admin(uuid);

-- Disable RLS on admin_users to prevent recursion
alter table if exists public.admin_users disable row level security;

-- Properties policies - simplified to avoid recursion
-- Public can read available properties, authenticated users can read all
create policy "Public can view available properties"
  on public.properties for select
  using (
    status = 'available' 
    or 
    auth.uid() is not null
  );

create policy "Authenticated users can insert properties"
  on public.properties for insert
  with check (auth.uid() is not null);

create policy "Authenticated users can update properties"
  on public.properties for update
  using (auth.uid() is not null);

create policy "Authenticated users can delete properties"
  on public.properties for delete
  using (auth.uid() is not null);

-- Property leads policies
create policy "Anyone can submit property leads"
  on public.property_leads for insert
  with check (true);

create policy "Authenticated users can view property leads"
  on public.property_leads for select
  using (auth.uid() is not null);

-- Property submissions policies
create policy "Anyone can submit properties"
  on public.property_submissions for insert
  with check (true);

create policy "Authenticated users can view property submissions"
  on public.property_submissions for select
  using (auth.uid() is not null);

create policy "Authenticated users can update property submissions"
  on public.property_submissions for update
  using (auth.uid() is not null);
