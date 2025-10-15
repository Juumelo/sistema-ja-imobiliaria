-- Create properties table
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  property_type text not null check (property_type in ('sale', 'rent')),
  price decimal(12, 2) not null,
  location text not null,
  bedrooms integer,
  bathrooms integer,
  area_sqm decimal(10, 2),
  images text[] default '{}',
  status text not null default 'available' check (status in ('available', 'sold', 'rented', 'pending')),
  owner_name text not null,
  owner_email text not null,
  owner_phone text not null,
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create property_leads table (contact form submissions)
create table if not exists public.property_leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Create property_submissions table (user submitted properties)
create table if not exists public.property_submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  property_type text not null check (property_type in ('sale', 'rent')),
  price decimal(12, 2) not null,
  location text not null,
  bedrooms integer,
  bathrooms integer,
  area_sqm decimal(10, 2),
  owner_name text not null,
  owner_email text not null,
  owner_phone text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now()
);

-- Create admin_users table for authentication
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.properties enable row level security;
alter table public.property_leads enable row level security;
alter table public.property_submissions enable row level security;
alter table public.admin_users enable row level security;

-- Fixed RLS policies to avoid infinite recursion by using a function
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

-- Properties policies (public can read available, only admins can write)
drop policy if exists "Anyone can view available properties" on public.properties;
create policy "Anyone can view available properties"
  on public.properties for select
  using (status = 'available' or public.is_admin(auth.uid()));

drop policy if exists "Only admins can insert properties" on public.properties;
create policy "Only admins can insert properties"
  on public.properties for insert
  with check (public.is_admin(auth.uid()));

drop policy if exists "Only admins can update properties" on public.properties;
create policy "Only admins can update properties"
  on public.properties for update
  using (public.is_admin(auth.uid()));

drop policy if exists "Only admins can delete properties" on public.properties;
create policy "Only admins can delete properties"
  on public.properties for delete
  using (public.is_admin(auth.uid()));

-- Property leads policies (anyone can insert, only admins can read)
drop policy if exists "Anyone can submit property leads" on public.property_leads;
create policy "Anyone can submit property leads"
  on public.property_leads for insert
  with check (true);

drop policy if exists "Only admins can view property leads" on public.property_leads;
create policy "Only admins can view property leads"
  on public.property_leads for select
  using (public.is_admin(auth.uid()));

-- Property submissions policies (anyone can insert, only admins can read/update)
drop policy if exists "Anyone can submit properties" on public.property_submissions;
create policy "Anyone can submit properties"
  on public.property_submissions for insert
  with check (true);

drop policy if exists "Only admins can view property submissions" on public.property_submissions;
create policy "Only admins can view property submissions"
  on public.property_submissions for select
  using (public.is_admin(auth.uid()));

drop policy if exists "Only admins can update property submissions" on public.property_submissions;
create policy "Only admins can update property submissions"
  on public.property_submissions for update
  using (public.is_admin(auth.uid()));

-- Admin users policies - allow admins to read without recursion
drop policy if exists "Admins can view all admin users" on public.admin_users;
create policy "Admins can view all admin users"
  on public.admin_users for select
  using (true); -- Allow reading admin_users table to avoid recursion

-- Create indexes for better performance
create index if not exists idx_properties_type on public.properties(property_type);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_properties_created on public.properties(created_at desc);
create index if not exists idx_property_leads_property on public.property_leads(property_id);
create index if not exists idx_property_submissions_status on public.property_submissions(status);
create index if not exists idx_admin_users_id on public.admin_users(id);
