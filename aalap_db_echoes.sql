-- RUN THIS IN SUPABASE SQL EDITOR TO ENABLE COMMENTS

create table public.echoes (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  body text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.echoes enable row level security;

create policy "Echoes are viewable by everyone." on echoes for select using ( true );
create policy "Authenticated users can post echoes." on echoes for insert with check ( auth.uid() = user_id );
create policy "Users can delete their own echoes." on echoes for delete using ( auth.uid() = user_id );