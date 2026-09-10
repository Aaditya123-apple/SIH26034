create table if not exists public.reports (
  id text primary key,
  product_name text not null,
  product_id text not null,
  category text not null,
  compliance_score numeric(5, 2) not null check (compliance_score >= 0 and compliance_score <= 100),
  status text not null check (status in ('Compliant', 'Partially Compliant', 'Non-Compliant')),
  date date not null,
  violations jsonb not null default '[]'::jsonb,
  factory_info jsonb not null,
  law_violations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Authenticated users can read reports"
on public.reports for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('inspection-images', 'inspection-images', false)
on conflict (id) do nothing;

create policy "Authenticated users can upload inspection images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'inspection-images');

create policy "Authenticated users can read inspection images"
on storage.objects for select
to authenticated
using (bucket_id = 'inspection-images');
