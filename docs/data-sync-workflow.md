## 🚛 Database Schema & Data Sync Workflow

This document captures how we keep **local**, **cloud**, and **CI** Postgres instances in sync for both _schema_ (migrations) and _bulk recipe data_.

---

### 1. Folder Structure

```
/supabase/
  migrations/               # *.sql files – never edit once applied
  recipes.csv               # Kaggle dump (or keep in S3 & curl in script)
/scripts/
  seed_local.sh             # COPY + transform into canonical table
  sync_data.sh              # push new rows to cloud
```

### 2. Local Development Loop

| Step | Command                                                          | Purpose                                                       |
| ---- | ---------------------------------------------------------------- | ------------------------------------------------------------- |
| 1    | `supabase db reset`                                              | fresh local DB, re-applies all migrations                     |
| 2    | `./scripts/seed_local.sh`                                        | `COPY` CSV → `recipes_import_kaggle` → transform to `recipes` |
| 3    | Code, run app, regeneration                                      | iterate                                                       |
| 4    | `supabase gen types typescript --local > src/server/types_db.ts` | keep TS types in sync                                         |

### 3. Scripts

#### `scripts/seed_local.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
CSV=${1-"supabase/recipes.csv"}
CONN="postgresql://postgres:postgres@localhost:54322/postgres"

psql "$CONN" -c "\copy recipes_import_kaggle \
  (row_index,recipe_name,prep_time,cook_time,total_time,servings,yield_raw,ingredients,directions,rating,url,cuisine_path,nutrition_raw,timing_raw,img_src) \
  FROM '$CSV' WITH (FORMAT csv, HEADER true)"

# transform → canonical
psql "$CONN" -f scripts/transform_kaggle.sql
```

#### `scripts/sync_data.sh`

Uploads only new rows (idempotent):

```bash
#!/usr/bin/env bash
set -euo pipefail
CSV=${1-"supabase/recipes.csv"}
CLOUD_CONN="$SUPABASE_URL"   # injected via env

psql "$CLOUD_CONN" -c "\copy recipes_import_kaggle \
  (row_index,recipe_name,prep_time,cook_time,total_time,servings,yield_raw,ingredients,directions,rating,url,cuisine_path,nutrition_raw,timing_raw,img_src) \
  FROM STDIN WITH (FORMAT csv, HEADER true)" < "$CSV"

psql "$CLOUD_CONN" -f scripts/transform_kaggle.sql
```

### 4. GitHub Actions

`.github/workflows/db-sync.yml`

```yaml
name: DB Sync
on:
  push:
    paths:
      - "supabase/migrations/**"
      - "supabase/recipes.csv"
      - "scripts/**"
      - ".github/workflows/db-sync.yml"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm add -g supabase
      - name: Push schema
        run: supabase db push --linked
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      - name: Sync data (CSV → cloud)
        run: ./scripts/sync_data.sh supabase/recipes.csv
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_DB_URL }}
```

### 5. Rules

1. **Never edit** an old migration; create a new `alter_*.sql` instead.
2. `INSERT … SELECT … on conflict do nothing` ensures scripts are idempotent.
3. Keep test data small; large datasets can live in object storage & streamed in CI.

---

Maintainer: `@dev` • Last updated: $(date)
