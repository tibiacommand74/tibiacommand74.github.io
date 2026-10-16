create table public.community_timer_sets (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,
 character text not null check(char_length(character) between 2 and 40 and character=lower(btrim(character))),
 server text not null check(char_length(server) between 2 and 60 and server=lower(btrim(server))),
 name text not null check(char_length(btrim(name)) between 2 and 100),
 config jsonb not null check(jsonb_typeof(config)='object' and octet_length(config::text)<=16000),
 archived boolean not null default false,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index community_timer_sets_owner on public.community_timer_sets(user_id,character,server,archived,created_at desc);
alter table public.community_timer_sets enable row level security;
revoke all on public.community_timer_sets from public,anon,authenticated;
grant select on public.community_timer_sets to authenticated;
grant insert(user_id,character,server,name,config) on public.community_timer_sets to authenticated;
grant update(name,config,archived,updated_at) on public.community_timer_sets to authenticated;
create policy timer_sets_select on public.community_timer_sets for select to authenticated using ((select auth.uid())=user_id);
create policy timer_sets_insert on public.community_timer_sets for insert to authenticated with check ((select auth.uid())=user_id);
create policy timer_sets_update on public.community_timer_sets for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
