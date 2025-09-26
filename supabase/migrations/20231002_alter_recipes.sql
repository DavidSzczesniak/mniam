-- Add the new columns
alter table recipes
  add column if not exists description   text,
  add column if not exists ingredients   text[],
  add column if not exists steps         text[],
  add column if not exists rating        numeric,
  add column if not exists nutrition     jsonb,
  add column if not exists is_enriched   boolean default false;