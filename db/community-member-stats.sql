-- Public output contains totals only; membership and activity rows stay protected.
create schema if not exists community_private;
revoke all on schema community_private from public, anon, authenticated;
grant usage on schema community_private to service_role;
create table public.community_presence (
 user_id uuid primary key references auth.users(id) on delete cascade,
 last_seen timestamptz not null default now()
);
alter table public.community_presence enable row level security;
revoke all on public.community_presence from public, anon, authenticated;
grant select, insert, update on public.community_presence to authenticated;
grant select on public.community_presence to service_role;
create policy presence_own_select on public.community_presence for select to authenticated using ((select auth.uid())=user_id);
create policy presence_own_insert on public.community_presence for insert to authenticated with check ((select auth.uid())=user_id);
create policy presence_own_update on public.community_presence for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create function community_private.presence_server_time() returns trigger language plpgsql security invoker set search_path='' as $$ begin new.last_seen=now(); return new; end $$;
create trigger presence_server_time before insert or update on public.community_presence for each row execute function community_private.presence_server_time();
create function public.community_presence_touch() returns void language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 insert into public.community_presence(user_id,last_seen) values(auth.uid(),now()) on conflict(user_id) do update set last_seen=now();
end $$;
revoke all on function public.community_presence_touch() from public,anon;
grant execute on function public.community_presence_touch() to authenticated;
-- This backend-only aggregate intentionally crosses auth and presence tables.
create function community_private.member_totals() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if coalesce(current_setting('request.jwt.claims',true)::jsonb->>'role','') <> 'service_role' then raise exception 'Backend only'; end if;
 return jsonb_build_object('registered',(select count(*) from auth.users where email_confirmed_at is not null and deleted_at is null and not coalesce(is_anonymous,false)),
 'online',(select count(*) from public.community_presence p join auth.users u on u.id=p.user_id where p.last_seen>now()-interval '5 minutes' and u.email_confirmed_at is not null and u.deleted_at is null and not coalesce(u.is_anonymous,false)));
end $$;
revoke all on function community_private.member_totals() from public,anon,authenticated;
grant execute on function community_private.member_totals() to service_role;
create function public.community_member_totals() returns jsonb language sql security invoker set search_path='' as $$ select community_private.member_totals(); $$;
revoke all on function public.community_member_totals() from public,anon,authenticated;
grant execute on function public.community_member_totals() to service_role;
