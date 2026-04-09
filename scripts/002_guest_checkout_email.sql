-- Enable guest checkout by email while keeping existing user-linked bookings compatible.
alter table public.bookings
  add column if not exists email text;

alter table public.bookings
  alter column user_id drop not null;

create index if not exists bookings_email_idx on public.bookings(email);
