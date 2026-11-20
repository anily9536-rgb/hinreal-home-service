# Real Home Service — Ahmedabad Property Portal

This is a full-stack starter project (Next.js + Supabase). It includes property listings, customer sign-up/login, multi-photo upload, enquiry submission, and an admin approval dashboard.

## 1. Create the Supabase backend
1. Create a project at https://supabase.com/
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it.
3. In **Project Settings → API**, copy the Project URL and publishable/anon key.
4. Create `.env.local` in this project using `.env.example` and paste those values.

## 2. Create the first admin
1. Sign up through `/login` in the running website.
2. In Supabase → Table Editor → `profiles`, find your user row.
3. Change `role` from `customer` to `admin`.
4. Log in again and open `/admin`.

Do not put a Supabase service-role key in browser code or commit it to GitHub.

## 3. Run locally
Install Node.js 20 or newer, then:
```bash
npm install
npm run dev
```
Open http://localhost:3000

## 4. Deploy
Push the project to a private/public GitHub repository and import it into Vercel. Add the two `.env.local` values as Vercel Environment Variables, then deploy. Connect a custom domain after the first deployment.

## Included pages
- `/` public approved property listings + Buy/Rent/locality search
- `/login` customer signup and login
- `/sell` property submission and up to 10 photos (login required)
- `/property/[id]` property details and customer enquiry
- `/admin` admin-only moderation and enquiry dashboard

## Important before going live
- Add your business phone, email, office address, privacy policy, terms and property listing rules.
- Verify enquiry phone numbers and moderate listings.
- Set Supabase Auth email templates and production redirect URLs.
- Consider CAPTCHA/rate limiting and enquiry spam protection before public launch.
- This starter does not include online payments, maps, OTP login, or automatic WhatsApp messages.
