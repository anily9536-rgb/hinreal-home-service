# Real Home Service

Next.js + Supabase property marketplace.

## Setup
1. Upload the contents of this ZIP (not the ZIP itself) to the root of your GitHub repository.
2. In Vercel, keep the project connected to this repository and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Install dependencies and deploy.
4. Review `schema.sql` and run it in Supabase SQL Editor only if the matching tables/policies do not already exist. Do not run duplicate table creation blindly on a live database.
5. Create an admin user in Supabase Authentication. Then set that user's profile role to `admin` using the SQL example below, replacing the email:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'YOUR_ADMIN_EMAIL');
   ```

## Notes
- Never put a Supabase service-role key in browser environment variables.
- The public anon key is designed for client use; protect data with Row Level Security.
- `/sell` requires a signed-in user.
- `/admin` requires an authenticated user whose `profiles.role` is `admin`.
