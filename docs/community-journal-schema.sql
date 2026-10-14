create table public.community_journal (
 user_id uuid not null references auth.users(id) on delete cascade,
 character text not null check (char_length(character) between 2 and 40),
 server text not null check (char_length(server) between 2 and 60),
 entry_key text not null check (char_length(entry_key) between 3 and 160),
 record jsonb not null check (jsonb_typeof(record)='object' and octet_length(record::text)<=10000),
 updated_at timestamptz not null default now(),
 primary key(user_id,character,server,entry_key)
);
alter table public.community_journal enable row level security;
revoke all on public.community_journal from anon;
grant select,insert,update on public.community_journal to authenticated;
create policy journal_read on public.community_journal for select to authenticated using ((select auth.uid())=user_id);
create policy journal_insert on public.community_journal for insert to authenticated with check ((select auth.uid())=user_id);
create policy journal_update on public.community_journal for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);