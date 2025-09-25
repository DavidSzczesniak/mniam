-- Users are auto-managed by Supabase Auth
create table if not exists preferences (
  user_id uuid primary key references auth.users on delete cascade,
  dietary text[] default '{}',
  disliked_ingredients text[] default '{}',
  max_cook_time int
);

create table if not exists recipes (
  id           bigint generated always as identity primary key,
  user_id      uuid references auth.users on delete set null,
  title        text not null,
  cuisine      text,
  prep_minutes int,
  cook_minutes int,
  servings     int,
  image_url    text,
  imported_from text,             -- API name or "manual"
  created_at   timestamp with time zone default now()
);

create table if not exists recipe_ingredients (
  id        bigint generated always as identity primary key,
  recipe_id bigint references recipes on delete cascade,
  name      text not null,
  quantity  text
);

create table if not exists plans (
  id         bigint generated always as identity primary key,
  user_id    uuid references auth.users on delete cascade,
  week_start date not null,
  unique (user_id, week_start)
);

create table if not exists plan_items (
  id        bigint generated always as identity primary key,
  plan_id   bigint references plans on delete cascade,
  day       text check (day in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  recipe_id bigint references recipes,
  servings_override int
);