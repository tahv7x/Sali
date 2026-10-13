# Project Specification: Premium Sali Task Board (UI/UX Phase)

## 1. Project Overview
We are building a highly responsive, modern Sali Task Board application. This current phase is STRICTLY focused on Frontend UI, UX, animations, and interaction design. **We are not implementing any backend, database, or complex data models (Supabase will be integrated in a later phase with our backend).** 

The goal is to create a frictionless, high-end aesthetic interface that strictly adheres to the Apple Design System provided in `@design.md`. Use hardcoded mock data for all visual states.

## 2. Tech Stack Requirements
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4 (using exact tokens from `@design.md`)
- **Animations & Micro-interactions:** Framer Motion
- **Drag & Drop:** `@dnd-kit/core` and `@dnd-kit/sortable`
- **Icons:** `lucide-react` (clean, minimalist icons matching the Apple aesthetic)

## 3. UI/UX Core Principles (Apple Aesthetic)
- **No Shadows:** Use 1px hairline borders (`#d6d6d6`) and contrast between `Gallery White` (`#ffffff`) and `Studio Mist` (`#f5f5f7`) to create depth.
- **Typography:** Strict use of SF Pro Text and SF Pro Display (or standard fallbacks) with tight negative tracking as defined in `@design.md`.
- **Shapes:** Heavily rounded corners (`28px` for cards, `9999px` for pill buttons).
- **Interactions:** Buttery smooth Framer Motion transitions for every state change (hover, drag, drop, modal open).

## 4. Agile Roadmap (UI/UX Epics)
We will build the UI incrementally. **Do not jump ahead and do not write backend logic.**

### Epic 1: Project Setup & Design System Initialization
- Initialize Next.js App Router.
- Configure Tailwind CSS v4 custom properties EXACTLY as defined in `@design.md`.
- Build the global layout shell: `Global Store Navigation` (top bar) and `Studio Mist` canvas background.

### Epic 2: Base UI Components Library
- Build reusable UI primitives based on `@design.md`: 
  - `Pricing Blue` pill buttons (`9999px` radius).
  - Outlined `Explore Pill` controls.
  - Form inputs with `980px` radius.
  - Launch Labels (`Launch Orange`).

### Epic 3: The Landing Page & Dashboard UI
- Build a stunning, minimalist Landing Page Hero section with oversized typography (`80px/600` display).
- Build the Dashboard view (static UI) showing mock "Recent Boards" as `28px` radius `Gallery White` cards.

### Epic 4: Static Sali Board Interface
- Build the `Product Local Navigation` (Board Title & Settings).
- Render Columns and Task Cards using hardcoded mock data. 
- Ensure cards are pure white with hairline borders, featuring small priority indicators and assignee avatars.

### Epic 5: The Drag & Drop Experience
- Implement `@dnd-kit`.
- Add Framer Motion to make picking up, moving, and dropping cards feel incredibly satisfying and physical.
- (Only manipulate local React state with the mock data, no API calls).

### Epic 6: Task Details Modal (Slide-over)
- Create a beautiful Task Details view.
- Instead of a heavy modal, use a highly rounded (`28px`) centered card over a blurred `Paper Frost` backdrop, or a clean right-side slide-over panel.

## 5. Strict LLM Execution Directives
1. **Wait for Commands:** Read this document and `@design.md`. Acknowledge you understand the pure UI focus, the tech stack, and the design rules. Wait for me to say **"Start Epic [X]"** before writing any code.
2. **Design First:** Every component MUST perfectly match `@design.md`. Pure white cards, studio mist backgrounds, no drop shadows.
3. **Mock Data Only:** Use clean, realistic hardcoded arrays to populate the UI. Do not create complex TS data models or database schemas.