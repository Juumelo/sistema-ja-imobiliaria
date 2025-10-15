-- Disable RLS on admin_users table to prevent infinite recursion
-- The admin_users table is only used internally by the is_admin() function
-- and should not be directly accessible via the API anyway

-- Drop all policies on admin_users
drop policy if exists "Anyone can view admin users" on public.admin_users;
drop policy if exists "Admins can view all admin users" on public.admin_users;

-- Disable Row Level Security on admin_users
alter table public.admin_users disable row level security;

-- Recreate the is_admin function with security definer
-- This allows it to bypass RLS when checking admin status
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where id = user_id
  );
end;
$$ language plpgsql security definer stable;
