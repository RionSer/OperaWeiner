-- Enable guest checkout by email while keeping existing user-linked bookings compatible.
alter table public.bookings
  add column if not exists email text;

alter table public.bookings
  alter column user_id drop not null;

create index if not exists bookings_email_idx on public.bookings(email);

drop policy if exists bookings_select_own on public.bookings;
drop policy if exists bookings_insert_own on public.bookings;
drop policy if exists bookings_update_own on public.bookings;
drop policy if exists bookings_select_by_email on public.bookings;

create policy bookings_select_by_email
  on public.bookings
  for select
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
