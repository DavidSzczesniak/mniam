## 🧩 Problem Statement

Planning dinner is repetitive and time-consuming. Users struggle to remember meals they liked, waste time finding recipes, and build grocery lists manually.

## 🌟 Solution Overview

A responsive web app that helps users plan weekly dinners by recommending meals based on preferences and saved history. It also generates grocery lists and supports adding or editing custom recipes.

---

Make a basic meal planner app. Use mock data. Features include:

- Weekly dinner planner - select a meal for each day. select by filtering by cuisine type, dietary prefs, cook/prep-time, as well as with ingredient exclusion (e.g 'no onions')
- Recipes will be pulled from public APIs, but users can add their own also
- auto-generate recipe list for selected meals, that can be exported

## ✨ Core Features (MVP)

### 1. Weekly Dinner Planner

- User selects number of dinners
- Filters:
  - Cuisine type
  - Dietary preferences (vegetarian, keto, etc.)
  - Cook/prep time
  - **Ingredient exclusion** (e.g., “no onions”)

### 2. Recipe Recommendations

- Pull from public APIs
- Mix of new suggestions + auto-rotated past favorites
- Default 4-week cooldown on repeated meals

### 3. Recipe Memory & Manual Entry

- Save recipes used in past plans
- Add recipes via:
  - URL (auto-scraped)
  - Manual entry
  - Hybrid if scraping fails
- **Editable recipes** saved as user-owned copies

### 4. Grocery List Generator

- Auto-generated from selected meals
- Deduplicates ingredients
- Export options:
  - Copy to clipboard
  - Download as Markdown (`.md`)

### 5. Basic Onboarding

- Optional setup for:
  - Dietary needs
  - Disliked ingredients
  - Cuisine preferences
  - Max cook time

---

## 🔧 Technical Overview

### Platform

- **Responsive web app** built with **React.js**
- Support offline via **PWA (service workers)**

### Frontend

- React + Tailwind CSS (or UI framework)
- Pages:
  - Onboarding
  - Weekly planner
  - Recipe browser/detail
  - Manual recipe form
  - Grocery list view

### Backend

- Recipe API integration (e.g., Spoonacular, Edamam)
- Normalize to shared schema
- Store:
  - Recipes
  - Weekly plans
  - Grocery lists
  - Preferences + exclusions

- Possible stacks:
  - Firebase (auth, Firestore, hosting)
  - Supabase (Postgres + auth)
  - Node.js + MongoDB/Postgres

### Storage & Sync

- LocalStorage/IndexedDB for temporary use
- Cloud sync on login
- Account required for persistent data

---

## 📈 Future Features (Backlog)

- Custom repeat settings per recipe
- Smart preference learning
- Grocery list categorization
- Weekly planning reminders
- Support for breakfast/lunch
- Sharing recipes or plans
- Recipe import from Pinterest/Instagram

---

# 🛠️ Tech Stack – Weekly Dinner Planner

## ✅ Chosen Stack: Structured & Flexible (Supabase)

This stack is selected for long-term scalability, relational data modeling, real-time capabilities, and solid developer experience.

---

## 🧱 Frontend

### Framework

- **React.js** – Component-based UI architecture

### Styling

- **Tailwind CSS** – Utility-first styling
- **shadcn/ui** – Prebuilt component library styled with Tailwind (great dev UX, clean design)

### State & Data

- **React Query** – Async data fetching & caching
- **Zustand or Context API** – Lightweight global state (for planner state, user session)

### Offline Support

- **PWA support** (via service workers)
- **Supabase client caching** (in-memory or IndexedDB)

---

## 🧰 Backend

### Supabase (as Backend-as-a-Service)

- **Database**: PostgreSQL (fully managed)
- **Auth**: Supabase Auth (email + magic links, OAuth optional)
- **API**: Auto-generated RESTful & Realtime API from schema
- **Storage**: For user-uploaded content (e.g., recipe images)
- **Edge Functions (optional)**: For custom server-side logic like scraping fallback

---

## 🗃️ Database Schema (Initial Draft)

### Tables:

- `users` – ID, preferences, dietary restrictions
- `recipes` – ID, title, ingredients, steps, tags, user_id (nullable if from API)
- `plans` – ID, user_id, date, recipe_id
- `grocery_items` – ID, plan_id, name, quantity, unit
- `tags` – e.g., vegan, gluten-free, cuisine types

---

## 🔐 Auth & Sync

- Use Supabase Auth for secure, scalable login
- Support local session with sync on login
- JWT or Supabase session management

---

## ⚙️ Dev Tools & Hosting

- **Netlify** – Frontend hosting
- **Supabase** – Backend + DB hosting
- **GitHub** – Repo + CI/CD
- **Storybook** – For UI component development (optional)

---

## ✅ Why This Stack?

- SQL support = easier filtering, relationships, and complex queries
- Authentication, database, storage, and API out of the box
- Good developer experience
- Scalable and production-ready
