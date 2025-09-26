-- 1️⃣  STAGING  ─ mirrors CSV verbatim
create table if not exists recipes_import_kaggle (
  row_index     bigint primary key,                 -- the blank leading column
  recipe_name   text,
  prep_time     text,
  cook_time     text,
  total_time    text,
  servings      text,
  yield_raw     text,
  ingredients   text,                               -- "['milk','eggs', …]"
  directions    text,
  rating        numeric,
  url           text,
  cuisine_path  text,
  nutrition_raw text,
  timing_raw    text,
  img_src       text,

  imported_at   timestamptz default now()
);