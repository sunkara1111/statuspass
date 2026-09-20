alter table employers add column if not exists is_sample boolean not null default false;

insert into employers (legal_name, ein, everify_company_id, everify_status, hq_city, hq_state, website, is_sample)
values
  ('Northlake Analytics LLC', '11-1111111', 'EV-SAMPLE-001', 'everify_and_lca', 'Austin', 'TX', 'https://example.com/northlake', true),
  ('Harbor Bridge Software Inc', '22-2222222', 'EV-SAMPLE-002', 'everify_listed', 'Seattle', 'WA', 'https://example.com/harbor', true),
  ('Cedar & Pine Research', '33-3333333', 'EV-SAMPLE-003', 'everify_and_lca', 'Boston', 'MA', 'https://example.com/cedar', true),
  ('Midwest Circuits Corp', '44-4444444', 'EV-SAMPLE-004', 'everify_listed', 'Chicago', 'IL', 'https://example.com/midwest', true),
  ('Sonoma Health Systems', '55-5555555', 'EV-SAMPLE-005', 'lca_listed', 'San Jose', 'CA', 'https://example.com/sonoma', true),
  ('Redwood Robotics', '66-6666666', 'EV-SAMPLE-006', 'everify_and_lca', 'Pittsburgh', 'PA', 'https://example.com/redwood', true),
  ('Atlantic Data Co', '77-7777777', 'EV-SAMPLE-007', 'unverified', 'New York', 'NY', 'https://example.com/atlantic', true),
  ('Prairie STEM Labs', '88-8888888', 'EV-SAMPLE-008', 'everify_listed', 'Minneapolis', 'MN', 'https://example.com/prairie', true);
