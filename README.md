# NexusBoard

Production-ready collaborative SaaS app built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## 1) Architecture overview

- **Frontend (Next.js App Router)**
  - Server Components for initial dashboard/profile data hydration.
  - Client Components for interactive todo/note/file/share workflows.
  - Route handlers under `app/api/*` to keep browser secrets isolated.
- **Backend (Supabase)**
  - Auth: email/password via Supabase Auth.
  - Postgres: relational schema with RLS enforcement.
  - Storage: private `uploads` bucket with owner-only policies.
- **Security**
  - RLS on all application tables.
  - Access checks for owner/shared users.
  - Storage object access constrained by authenticated owner.

## 2) Folder structure

```text
.
├── app/
│   ├── (auth)/login,signup            # Auth screens
│   ├── (dashboard)/*                  # SaaS dashboard pages
│   └── api/*                          # Next.js route handlers
├── components/
│   ├── layout/                        # Sidebar + theme controls
│   ├── notes/, todos/, shared/        # Domain UI modules
│   └── ui/                            # Reusable forms/upload widgets
├── db/
│   └── schema.sql                     # Complete Supabase SQL + RLS policies
├── lib/
│   ├── supabase/                      # Client/server/route Supabase utilities
│   ├── types.ts                       # Shared TypeScript domain types
│   └── utils.ts                       # Utility helpers
├── public/                            # Static files
├── .env.example                       # Required environment variables
└── README.md
```

## 3) Setup instructions

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create Supabase project** and enable email/password provider.
3. **Run SQL schema**
   - Open Supabase SQL editor.
   - Paste `db/schema.sql` and execute.
4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill values from Supabase project settings.
5. **Run app locally**
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000`.

## 4) Supabase SQL schema

- Full schema, indexes, triggers, RLS policies, and storage policies are in:
  - `db/schema.sql`

## 5) Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (reserved for server-side admin tasks)

## 6) Vercel deployment

1. Push repository to GitHub.
2. Import project into Vercel.
3. Add env vars from `.env.example` in Vercel Project Settings.
4. Deploy. Vercel auto-detects Next.js.
5. Verify production auth callback domain matches your Vercel URL in Supabase Auth settings.

## 7) Feature checklist implemented

- Email/password authentication.
- Profile management.
- Todo CRUD + status workflow + assignment field.
- Markdown notes CRUD + URL/YouTube embed.
- Image/file upload to private Supabase Storage + metadata.
- Resource sharing table + role-based access model.
- Responsive dashboard with sidebar and dark mode toggle.

## 8) Production hardening recommendations

- Add optimistic UI and retry handling.
- Add Zod validation in API handlers.
- Add audit logs and activity feed.
- Add background jobs for notifications/reminders.
- Add integration tests (Playwright + Supabase test project).
