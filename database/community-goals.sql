create table public.community_goals(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 character text not null check(char_length(character) between 2 and 40),
 server text not null check(char_length(server) between 2 and 60),
 kind text not null check(kind in ('gold','equipment')),
 title text not null check(char_length(btrim(title)) between 2 and 100),
 item_id text check(char_length(item_id)<=80),
 target bigint not null check(target between 1 and 1000000000000),
 initial bigint not null default 0 check(initial between 0 and 1000000000000),
 notes text not null default '' check(char_length(notes)<=1000),
 archived boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(id,user_id)
);
create index community_goals_owner_context on public.community_goals(user_id,character,server,created_at desc);
create unique index community_hunts_id_owner on public.community_hunt_sessions(id,user_id);
create table public.community_goal_credits(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 goal_id uuid not null,
 hunt_id uuid not null,
 amount bigint not null check(amount between -1000000000000 and 1000000000000),
 created_at timestamptz not null default now(),
 unique(goal_id,hunt_id),
 foreign key(goal_id,user_id) references public.community_goals(id,user_id) on delete cascade,
 foreign key(hunt_id,user_id) references public.community_hunt_sessions(id,user_id) on delete cascade
);
create index community_goal_credits_owner on public.community_goal_credits(user_id,goal_id);
create index community_goal_credits_hunt on public.community_goal_credits(hunt_id,user_id);
alter table public.community_goals enable row level security;
alter table public.community_goal_credits enable row level security;
revoke all on public.community_goals,public.community_goal_credits from anon,authenticated;
grant select,insert on public.community_goals to authenticated;
grant update(kind,title,item_id,target,initial,notes,archived,updated_at) on public.community_goals to authenticated;
grant select,insert,delete on public.community_goal_credits to authenticated;
create policy goal_read_own on public.community_goals for select to authenticated using((select auth.uid())=user_id);
create policy goal_insert_own on public.community_goals for insert to authenticated with check((select auth.uid())=user_id);
create policy goal_update_own on public.community_goals for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
create policy credit_read_own on public.community_goal_credits for select to authenticated using((select auth.uid())=user_id);
create policy credit_insert_own on public.community_goal_credits for insert to authenticated with check(
 (select auth.uid())=user_id and exists(
  select 1 from public.community_goals g join public.community_hunt_sessions h on h.id=hunt_id and h.user_id=g.user_id
  where g.id=goal_id and g.user_id=(select auth.uid()) and g.character=h.character and g.server=h.server and not g.archived and not h.archived
 )
);
create policy credit_remove_own on public.community_goal_credits for delete to authenticated using((select auth.uid())=user_id);
