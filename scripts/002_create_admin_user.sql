-- Simplified admin user creation using environment variable
-- This script sets up the admin user based on the ADMIN_EMAIL environment variable

-- Create a function to handle admin user creation
create or replace function public.handle_new_admin_user()
returns trigger as $$
declare
  admin_email text;
begin
  -- Get admin email from environment variable
  admin_email := current_setting('request.env.ADMIN_EMAIL', true);
  
  -- If the new user's email matches the admin email, add them to admin_users
  if admin_email is not null and new.email = admin_email then
    insert into public.admin_users (id, email, full_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name')
    on conflict (id) do nothing;
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signups
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_admin_user();

-- Note: To create your first admin user:
-- 1. Make sure ADMIN_EMAIL environment variable is set in your Vercel project
-- 2. Go to your Supabase dashboard > Authentication > Users
-- 3. Click "Add user" and create a user with the email matching ADMIN_EMAIL
-- 4. The trigger will automatically add them to the admin_users table
