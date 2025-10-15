-- Migration to fix infinite recursion in RLS policies
-- Run this script to update existing policies

-- Drop existing policies that cause recursion
drop policy if exists "Anyone can view available properties" on public.properties;
drop policy if exists "Only admins can insert properties" on public.properties;
drop policy if exists "Only admins can update properties" on public.properties;
drop policy if exists "Only admins can delete properties" on public.properties;
drop policy if exists "Only admins can view property leads" on public.property_leads;
drop policy if exists "Only admins can view property submissions" on public.property_submissions;
drop policy if exists "Only admins can update property submissions" on public.property_submissions;
drop policy if exists "Admins can view all admin users" on public.admin_users;

-- Create a function to check if user is admin (avoids recursion in policies)
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where id = user_id
  );
end;
$$ language plpgsql security definer;

-- Recreate properties policies using the function
create policy "Anyone can view available properties"
  on public.properties for select
  using (status = 'available' or public.is_admin(auth.uid()));

create policy "Only admins can insert properties"
  on public.properties for insert
  with check (public.is_admin(auth.uid()));

create policy "Only admins can update properties"
  on public.properties for update
  using (public.is_admin(auth.uid()));

create policy "Only admins can delete properties"
  on public.properties for delete
  using (public.is_admin(auth.uid()));

-- Recreate property leads policies
create policy "Only admins can view property leads"
  on public.property_leads for select
  using (public.is_admin(auth.uid()));

-- Recreate property submissions policies
create policy "Only admins can view property submissions"
  on public.property_submissions for select
  using (public.is_admin(auth.uid()));

create policy "Only admins can update property submissions"
  on public.property_submissions for update
  using (public.is_admin(auth.uid()));

-- Fix admin_users policy to allow reading without recursion
create policy "Anyone can view admin users"
  on public.admin_users for select
  using (true);

-- Create index on admin_users for better performance
create index if not exists idx_admin_users_id on public.admin_users(id);
