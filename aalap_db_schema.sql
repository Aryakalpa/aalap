-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. PROFILES TABLE (Linked to Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- 2. POSTS TABLE
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) not null,
  title text not null,
  body text not null,
  category text default 'story',
  likes_count bigint default 0,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. LIKES TABLE (Many-to-Many)
create table public.likes (
  user_id uuid references public.profiles(id) not null,
  post_id uuid references public.posts(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (user_id, post_id)
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;

-- 5. POLICIES
-- Profiles: Everyone can read, User can edit own
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- Posts: Everyone can read, Author can edit
create policy "Public posts are viewable by everyone." on posts for select using ( true );
create policy "Authors can insert their own posts." on posts for insert with check ( auth.uid() = author_id );
create policy "Authors can update their own posts." on posts for update using ( auth.uid() = author_id );

-- Likes: Everyone can read, Auth users can toggle
create policy "Likes are viewable by everyone." on likes for select using ( true );
create policy "Authenticated users can insert likes." on likes for insert with check ( auth.uid() = user_id );
create policy "Authenticated users can delete likes." on likes for delete using ( auth.uid() = user_id );

-- 6. SEARCH INDEX (For Bengali/English Search)
create extension if not exists pg_trgm;
create index posts_title_trgm_idx on public.posts using gin (title gin_trgm_ops);
create index posts_body_trgm_idx on public.posts using gin (body gin_trgm_ops);

-- 7. AUTO-CREATE PROFILE ON SIGNUP (Trigger)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();