create table public.community_hunt_sessions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 character text not null check(char_length(character) between 2 and 40),
 server text not null check(char_length(server) between 2 and 60),
 name text not null check(char_length(btrim(name)) between 2 and 100),
 hunt_date date not null,
 minutes integer not null check(minutes between 1 and 10080),
 loot bigint not null check(loot between 0 and 1000000000000),
 costs bigint not null check(costs between 0 and 1000000000000),
 xp bigint check(xp between 0 and 1000000000000),
 notes text not null default '' check(char_length(notes)<=2000),
 party jsonb not null default '[]'::jsonb check(jsonb_typeof(party)='array' and jsonb_array_length(party)<=20 and octet_length(party::text)<=12000),
 archived boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index community_hunt_owner_character_date on public.community_hunt_sessions(user_id,character,server,hunt_date desc,id);
alter table public.community_hunt_sessions enable row level security;
revoke all on public.community_hunt_sessions from anon,authenticated;
grant select,insert,update on public.community_hunt_sessions to authenticated;
create policy hunt_read_own on public.community_hunt_sessions for select to authenticated using ((select auth.uid())=user_id);
create policy hunt_insert_own on public.community_hunt_sessions for insert to authenticated with check ((select auth.uid())=user_id);
create policy hunt_update_own on public.community_hunt_sessions for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
