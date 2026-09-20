-- 0004: affiliate example flag (SSN letter needs no new table)
ALTER TABLE affiliate_offers
  ADD COLUMN IF NOT EXISTS is_example boolean not null default true;
