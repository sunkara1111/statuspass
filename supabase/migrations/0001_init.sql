-- StatusPass Sprint 1 — PostgreSQL / Supabase
-- Compliance organizer, not a law firm or DSO.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type visa_status as enum (
  'incoming', 'active_f1', 'cpt', 'opt_pending', 'opt_authorized',
  'stem_opt', 'grace', 'terminated'
);
create type visa_class as enum ('f1', 'other');
create type degree_level as enum ('bachelors', 'masters', 'phd', 'other');
create type employment_kind as enum (
  'on_campus', 'cpt_part_time', 'cpt_full_time', 'opt', 'stem_opt',
  'unpaid_volunteer', 'unpaid_research'
);
create type form_type as enum (
  'i765', 'i983', 'ssn_request_letter', 'i20_request', 'other'
);
create type form_status as enum (
  'draft', 'ready', 'submitted', 'rfe', 'approved', 'denied', 'withdrawn'
);
create type timer_kind as enum (
  'cpt_full_time_days', 'opt_unemployment_days', 'stem_opt_unemployment_days',
  'i765_clock', 'i983_12mo_eval', 'i983_24mo_eval', 'program_end', 'grace_period'
);
create type timer_state as enum (
  'not_started', 'running', 'paused', 'exhausted', 'completed'
);
create type employer_verify_status as enum (
  'unverified', 'everify_listed', 'lca_listed', 'everify_and_lca'
);
create type notification_severity as enum ('info', 'warning', 'critical');
create type orientation_track as enum ('pre_arrival', 'cpt', 'opt', 'stem_opt');
create type document_kind as enum (
  'i20', 'passport', 'ead', 'i94', 'offer_letter', 'transcript', 'other'
);
create type notify_channel as enum ('push', 'email', 'in_app');
create type unemployment_reason as enum (
  'gap', 'waiting_ead', 'between_jobs', 'volunteer_pause'
);
create type affiliate_category as enum ('bank_no_ssn', 'esim', 'telecom');
create type pause_reason as enum (
  'paid_ev', 'qualifying_unpaid_research', 'sevp_volunteer'
);
create type alert_event_kind as enum (
  'morning_digest', 'hard_cap_warning', 'clock_exhausted'
);

-- ---------------------------------------------------------------------------
-- Utility
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  preferred_name text,
  email text not null,
  phone text,
  country_of_citizenship text,
  date_of_birth date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles (id) on delete cascade,
  sevis_id text unique,
  university_name text,
  sevis_school_code text,
  degree_level degree_level,
  major text,
  cip_code text check (cip_code is null or cip_code ~ '^\d{2}\.\d{4}$'),
  stem_eligible boolean not null default false,
  program_start_date date,
  program_end_date date,
  i20_expiry date,
  visa_class visa_class not null default 'f1',
  current_status visa_status not null default 'incoming',
  ead_category text,
  ead_valid_from date,
  ead_valid_to date,
  program_timezone text not null default 'America/New_York',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table visas (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  visa_class visa_class not null default 'f1',
  status visa_status not null,
  issued_at date,
  expires_at date,
  port_of_entry text,
  i94_number text,
  notes text,
  created_at timestamptz not null default now()
);

create table employers (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  dba_name text,
  ein text,
  everify_company_id text,
  everify_status employer_verify_status not null default 'unverified',
  naics text,
  hq_city text,
  hq_state text,
  website text,
  lca_case_numbers text[] not null default '{}',
  last_lca_synced_at timestamptz,
  created_at timestamptz not null default now()
);

create table employment_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  employer_id uuid references employers (id) on delete set null,
  kind employment_kind not null,
  job_title text,
  job_description text,
  start_date date not null,
  end_date date,
  is_full_time boolean not null default false,
  hours_per_week numeric(4,1),
  counts_toward_cpt_cap boolean not null default false,
  pause_reason pause_reason,
  policy_version text not null default 'sevp-2026.1',
  location_city text,
  location_state text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

create table form_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  form_type form_type not null,
  status form_status not null default 'draft',
  category_code text,
  payload jsonb not null default '{}',
  rejection_flags text[] not null default '{}',
  filing_fee_cents integer,
  signature_ok boolean,
  submitted_at timestamptz,
  uscis_receipt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table i983_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  employment_id uuid references employment_records (id) on delete set null,
  form_submission_id uuid references form_submissions (id) on delete set null,
  cip_code text,
  job_title text,
  training_goals text,
  employer_site_eval_due date,
  student_self_eval_12mo_due date,
  student_self_eval_24mo_due date,
  generated_sections jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table compliance_timers (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  kind timer_kind not null,
  state timer_state not null default 'not_started',
  limit_days integer not null,
  accrued_days numeric(6,2) not null default 0,
  paused_at timestamptz,
  last_computed_at timestamptz,
  starts_on date,
  ends_on date,
  alert_thresholds integer[] not null default '{30,14,7,3,1}',
  policy_source text not null default 'sevp',
  as_of date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, kind)
);

create table unemployment_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  timer_id uuid not null references compliance_timers (id) on delete cascade,
  started_on date not null,
  ended_on date,
  days_counted numeric(6,2) not null default 0,
  reason unemployment_reason not null,
  notes text,
  check (ended_on is null or ended_on >= started_on)
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  kind document_kind not null,
  storage_path text not null,
  expires_on date,
  created_at timestamptz not null default now()
);

create table orientation_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  track orientation_track not null,
  slug text not null,
  title text not null,
  body text,
  completed_at timestamptz,
  sort_order integer not null default 0,
  unique (student_id, track, slug)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  timer_id uuid references compliance_timers (id) on delete set null,
  severity notification_severity not null default 'info',
  title text not null,
  body text not null,
  send_at timestamptz not null default now(),
  sent_at timestamptz,
  read_at timestamptz,
  channel notify_channel not null default 'in_app'
);

create table roommate_profiles (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references students (id) on delete cascade,
  university text,
  arrive_on date,
  budget_min integer,
  budget_max integer,
  gender_pref text,
  notes text,
  looking boolean not null default true
);

create table affiliate_offers (
  id uuid primary key default gen_random_uuid(),
  category affiliate_category not null,
  partner_name text not null,
  headline text not null,
  url text not null,
  active boolean not null default true
);

create table alert_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  timer_id uuid references compliance_timers (id) on delete set null,
  kind alert_event_kind not null,
  local_date date not null,
  timezone text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (student_id, kind, local_date)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index students_cip_idx on students (cip_code);
create index students_status_idx on students (current_status);
create index employment_student_kind_start_idx
  on employment_records (student_id, kind, start_date);
create index timers_student_kind_idx on compliance_timers (student_id, kind);
create index employers_everify_idx on employers (everify_status);
create index forms_student_type_status_idx
  on form_submissions (student_id, form_type, status);
create index notifications_due_idx on notifications (student_id, send_at)
  where sent_at is null;
create unique index alert_events_idempotent_idx
  on alert_events (student_id, kind, local_date);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create trigger profiles_updated before update on profiles
  for each row execute function set_updated_at();
create trigger students_updated before update on students
  for each row execute function set_updated_at();
create trigger employment_updated before update on employment_records
  for each row execute function set_updated_at();
create trigger forms_updated before update on form_submissions
  for each row execute function set_updated_at();
create trigger i983_updated before update on i983_plans
  for each row execute function set_updated_at();
create trigger timers_updated before update on compliance_timers
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: student owns their graph; employers + offers are read-only catalog
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table students enable row level security;
alter table visas enable row level security;
alter table employers enable row level security;
alter table employment_records enable row level security;
alter table form_submissions enable row level security;
alter table i983_plans enable row level security;
alter table compliance_timers enable row level security;
alter table unemployment_events enable row level security;
alter table documents enable row level security;
alter table orientation_items enable row level security;
alter table notifications enable row level security;
alter table roommate_profiles enable row level security;
alter table affiliate_offers enable row level security;
alter table alert_events enable row level security;

create policy profiles_own on profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy students_own on students
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy visas_own on visas
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy employment_own on employment_records
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy forms_own on form_submissions
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy i983_own on i983_plans
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy timers_own on compliance_timers
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy unemp_own on unemployment_events
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy documents_own on documents
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy orientation_own on orientation_items
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy notifications_own on notifications
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy roommate_own on roommate_profiles
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy alert_events_own on alert_events
  for all using (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  ) with check (
    exists (select 1 from students s where s.id = student_id and s.profile_id = auth.uid())
  );

create policy employers_read on employers for select to authenticated using (true);
create policy offers_read on affiliate_offers for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Seed-friendly comments
-- Timer limits (application-enforced, also stored on the row):
--   cpt_full_time_days            364  (365th full-time CPT day kills OPT)
--   opt_unemployment_days          90
--   stem_opt_unemployment_days     60
-- counts_toward_cpt_cap = true only for cpt_full_time (part-time CPT does not count)
-- pause_reason null = does not pause unemployment; never treat generic unpaid as a pause
-- unemployment days are cumulative, counted in students.program_timezone (not UTC)
-- STEM OPT adds 60 days (150 total across the whole OPT period)
-- alert_events unique (student_id, kind, local_date) keeps morning digests idempotent
-- ---------------------------------------------------------------------------
