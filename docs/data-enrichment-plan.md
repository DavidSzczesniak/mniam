## 🍳 Data Enrichment Pipeline

> Turning raw Kaggle recipes into user-friendly content with nutrition facts & photos

---

### 1 Overview

We seed the database with bulk Kaggle datasets (MIT-licensed). A background worker then iteratively enriches each record:

1. Ingredient → nutrition JSON
2. Recipe title → illustrative image

Both steps store results back into Postgres and Supabase Storage so they’re cached forever.

### 2 Nutrition Generation

| Stage                 | Tool                      | Notes                                                                              |
| --------------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| **Parse ingredients** | Regex + tiny NLP model    | extract `quantity`, `unit`, `food`                                                 |
| **Lookup**            | USDA FoodData Central API | deterministic macros where match confidence ≥ 0.7                                  |
| **Fallback**          | GPT-4 (or Claude-Opus)    | prompt: _“Return calories, protein_g, carb_g, fat_g JSON for these ingredients …”_ |

```txt
recipes.nutrition_source = 'usda' | 'llm'
```

Approx. cost — 10 k GPT calls × 500 tokens × $0.002 ≈ **$20**.

### 3 Image Generation

| Strategy                        | When                            | Cost                        |
| ------------------------------- | ------------------------------- | --------------------------- |
| Unsplash/Pexels search          | first pass for every recipe     | free (attribution footer)   |
| DALL·E 3 (1024×)                | viewed recipe **without** image | $0.04 / image               |
| Stable Diffusion XL (local GPU) | nightly batch of most-viewed    | free compute if self-hosted |

Prompt template (LLM-refined):

```text
Top-down photograph of a plated {title}, natural lighting, neutral background.
```

Store in Supabase Storage → `recipes.image_url`.

### 4 Processing Workflow

1. Supabase Edge Function `enqueue_new_recipes()` – runs daily, pushes ids to an RLS-protected `enrichment_queue` table.
2. Background worker (Railway / Fly.io Job) consumes queue:
   1. Nutrition enrichment
   2. Photo enrichment
3. UPDATE row with new `nutrition_json`, `image_url`, and `enriched_at` timestamp.

### 5 Cost Guardrails

```env
MAX_GPT_CALLS_PER_DAY=500
MAX_IMAGE_GEN_PER_DAY=200
```

Cron stops when the quota is hit to avoid surprises.

### 6 User Transparency

- Display “Nutrition values are estimates.”
- Show camera-sparkle icon on AI-generated photos.
- Attribution footer:  
  “Recipe data © Kaggle Raw Recipes · Photos via Unsplash / OpenAI DALL·E.”

### 7 Future Ideas

- Fine-tune a lightweight model to parse ingredients = zero API cost.
- Cache vector embeddings to allow “find similar recipes” search.
- Crowdsource nutrition corrections from users.

---

**Owner:** @dev • **Last updated:** $(date)
