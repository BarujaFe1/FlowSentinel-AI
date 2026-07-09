# Supabase Setup

## 1. Create Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your project URL and anon key

## 2. Run Migration

```bash
npx supabase init
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Or paste `supabase/migrations/001_init.sql` in the SQL Editor.

## 3. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 4. Auth

Enable Email auth in Supabase Dashboard → Authentication → Providers.

## 5. Switch from Demo Mode

Set `NEXT_PUBLIC_DEMO_MODE=false` and wire auth callbacks to replace demo store reads/writes with Supabase queries.

## RLS

All tables have Row Level Security enabled. Users access data only through workspace membership.
