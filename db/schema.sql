-- Extensions
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.todo_status as enum ('pending', 'in_progress', 'done');
create type public.note_visibility as enum ('private', 'shared');
create type public.access_role as enum ('view', 'edit');
create type public.resource_type as enum ('todo', 'note');

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  status public.todo_status not null default 'pending',
  assigned_to uuid references public.profiles(id) on delete set null,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  markdown text not null,
  visibility public.note_visibility not null default 'private',
  cover_image_url text,
  embed_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  resource_type public.resource_type not null,
  resource_id uuid not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  shared_with uuid not null references public.profiles(id) on delete cascade,
  role public.access_role not null default 'view',
  created_at timestamptz not null default now(),
  unique (resource_type, resource_id, shared_with)
);

create table if not exists public.file_uploads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_todos_owner on public.todos(owner_id);
create index if not exists idx_notes_owner on public.notes(owner_id);
create index if not exists idx_shares_shared_with on public.shares(shared_with);

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on public.profiles
for each row execute procedure public.handle_updated_at();
create trigger trg_todos_updated_at before update on public.todos
for each row execute procedure public.handle_updated_at();
create trigger trg_notes_updated_at before update on public.notes
for each row execute procedure public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.todos enable row level security;
alter table public.notes enable row level security;
alter table public.shares enable row level security;
alter table public.file_uploads enable row level security;

create policy "profiles_select_self" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);

create or replace function public.can_access_resource(r_type public.resource_type, r_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.shares s
    where s.resource_type = r_type and s.resource_id = r_id and s.shared_with = auth.uid()
  );
$$;

create or replace function public.can_edit_resource(r_type public.resource_type, r_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.shares s
    where s.resource_type = r_type and s.resource_id = r_id and s.shared_with = auth.uid() and s.role = 'edit'
  );
$$;

create policy "todos_read" on public.todos for select using (owner_id = auth.uid() or assigned_to = auth.uid() or public.can_access_resource('todo', id));
create policy "todos_insert" on public.todos for insert with check (owner_id = auth.uid());
create policy "todos_update" on public.todos for update using (owner_id = auth.uid() or public.can_edit_resource('todo', id));
create policy "todos_delete" on public.todos for delete using (owner_id = auth.uid());

create policy "notes_read" on public.notes for select using (owner_id = auth.uid() or (visibility = 'shared' and public.can_access_resource('note', id)));
create policy "notes_insert" on public.notes for insert with check (owner_id = auth.uid());
create policy "notes_update" on public.notes for update using (owner_id = auth.uid() or public.can_edit_resource('note', id));
create policy "notes_delete" on public.notes for delete using (owner_id = auth.uid());

create policy "shares_read" on public.shares for select using (owner_id = auth.uid() or shared_with = auth.uid());
create policy "shares_insert" on public.shares for insert with check (owner_id = auth.uid());
create policy "shares_delete" on public.shares for delete using (owner_id = auth.uid());

create policy "files_read" on public.file_uploads for select using (owner_id = auth.uid());
create policy "files_insert" on public.file_uploads for insert with check (owner_id = auth.uid());
create policy "files_delete" on public.file_uploads for delete using (owner_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', false)
on conflict (id) do nothing;

create policy "storage_uploads_select" on storage.objects
for select using (bucket_id = 'uploads' and owner = auth.uid());
create policy "storage_uploads_insert" on storage.objects
for insert with check (bucket_id = 'uploads' and owner = auth.uid());
create policy "storage_uploads_delete" on storage.objects
for delete using (bucket_id = 'uploads' and owner = auth.uid());
