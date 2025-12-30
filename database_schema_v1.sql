-- AALAP DATABASE SCHEMA V1.0 (MAGNUM OPUS)
-- Run this in Supabase SQL Editor

-- 1. PROFILES
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  display_name text,
  bio text,
  avatar_url text,
  updated_at timestamp with time zone
);
alter table profiles enable row level security;
create policy "Public profiles" on profiles for select using (true);
create policy "User update own" on profiles for update using (auth.uid() = id);

-- 2. POSTS
create table posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  body text not null,
  category text default 'story',
  likes_count bigint default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table posts enable row level security;
create policy "Public posts" on posts for select using (true);
create policy "Author update own" on posts for update using (auth.uid() = author_id);
create policy "Author insert own" on posts for insert with check (auth.uid() = author_id);

-- 3. LIKES
create table likes (
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  primary key (user_id, post_id)
);
alter table likes enable row level security;
create policy "Public likes" on likes for select using (true);
create policy "User toggle likes" on likes for all using (auth.uid() = user_id);

-- 4. STORAGE (AVATARS)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
create policy "Avatar images are publicly accessible." on storage.objects for select using ( bucket_id = 'avatars' );
create policy "Anyone can upload an avatar." on storage.objects for insert with check ( bucket_id = 'avatars' );

-- 5. TRIGGER (New User -> Profile)
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();