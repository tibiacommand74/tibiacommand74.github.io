create table public.community_feedback (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 alias text not null check(char_length(trim(alias)) between 2 and 60),
 category text not null check(category in ('opiniao','sugestao','problema')),
 rating integer check(rating between 1 and 5),
 message text not null check(char_length(trim(message)) between 10 and 1500),
 created_at timestamptz not null default now()
);
alter table public.community_feedback enable row level security;
revoke all on public.community_feedback from anon, authenticated;
grant select(id,alias,category,rating,message,created_at) on public.community_feedback to anon,authenticated;
grant insert(alias,category,rating,message) on public.community_feedback to authenticated;
create policy feedback_public_read on public.community_feedback for select to anon,authenticated using(true);
create policy feedback_own_insert on public.community_feedback for insert to authenticated with check ((select auth.uid())=user_id and not coalesce((select auth.jwt()->>'is_anonymous')::boolean,false));
create index feedback_created on public.community_feedback(created_at desc);
create index feedback_user_created on public.community_feedback(user_id,created_at desc);
create schema if not exists community_private;
create function community_private.feedback_limit() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or auth.uid()<>new.user_id then raise exception 'Entre na sua conta para comentar.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(new.user_id::text,0));
 if exists(select 1 from public.community_feedback where user_id=new.user_id and created_at>now()-interval '1 minute') then raise exception 'Aguarde um minuto antes de comentar novamente.'; end if;
 if (select count(*) from public.community_feedback where user_id=new.user_id and created_at>now()-interval '1 day')>=10 then raise exception 'Você atingiu o limite de comentários de hoje.'; end if;
 return new;
end; $$;
revoke all on function community_private.feedback_limit() from public,anon,authenticated;
create trigger feedback_limit before insert on public.community_feedback for each row execute function community_private.feedback_limit();