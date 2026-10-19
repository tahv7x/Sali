<div align="center">

# Sali — Premium Task Board

**A frictionless, high-end task management interface built with the Apple design aesthetic.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.1-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## Overview

Sali is a **premium task board application** inspired by the Apple design language — clean, minimal, and purposefully beautiful. The current phase is focused entirely on the frontend UI/UX: animations, micro-interactions, and pixel-perfect design fidelity.

> **Backend & database integration (Supabase) are planned for a future phase.** All data is currently hardcoded mock data.

---

## ✨ Features

- **Apple-Aesthetic UI** — Pure white canvas, Studio Mist backgrounds, and hairline `1px` borders instead of shadows
- **Drag & Drop** — Physically satisfying card interactions powered by `@dnd-kit`
- **Fluid Animations** — Buttery smooth Framer Motion transitions on every state change: hover, drag, drop, and modal open
- **Task Details Slide-Over** — Beautiful `28px`-radius modal with a blurred `Paper Frost` backdrop
- **Responsive Design** — Mobile-first layout that adapts to any screen size
- **Custom Design System** — Fully tokenized color palette, typography scale, and spacing system (Tailwind v4)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.4 (App Router) |
| **Language** | TypeScript 6.0 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion 14.1 |
| **Drag & Drop** | @dnd-kit/core + @dnd-kit/sortable |
| **Icons** | lucide-react |

---

## 🎨 Design System

Sali uses a strict token-based design system derived from the Apple aesthetic:

### Color Palette

| Token | Value | Role |
|---|---|---|
| `Gallery White` | `#ffffff` | Primary canvas, cards, hero |
| `Studio Mist` | `#f5f5f7` | Section bands, backdrop |
| `Paper Frost` | `#fafafc` | Navigation overlay |
| `Ink` | `#1d1d1f` | Headlines & body copy |
| `Pricing Blue` | `#0071e3` | CTA buttons |
| `Apple Blue` | `#0066cc` | Inline links |
| `Hairline Silver` | `#d6d6d6` | 1px dividers & borders |
| `Launch Orange` | `#b64400` | Status labels |

### Typography

- **SF Pro Display** — Hero headlines, feature statements, product names
- **SF Pro Text** — Navigation, body copy, buttons, labels
- Hero display: `80px / 600 weight / -1.2px tracking`
- Cards: `28px` border radius • Buttons: `9999px` radius • Inputs: `980px` radius

---

## 🗺️ Roadmap

| Epic | Feature | Status |
|---|---|---|
| **Epic 1** | Project Setup & Design System | ✅ Done |
| **Epic 2** | Base UI Component Library | 🔄 In Progress |
| **Epic 3** | Landing Page & Dashboard | ⬜ Planned |
| **Epic 4** | Static Board Interface | ⬜ Planned |
| **Epic 5** | Drag & Drop Experience | ⬜ Planned |
| **Epic 6** | Task Details Slide-Over | ⬜ Planned |
| **Future** | Backend (Supabase) | ⬜ Planned |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **npm** or **yarn** or **pnpm**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tahv7x/sali-app.git
cd sali-app

# 2. Navigate to the frontend directory
cd frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server (with Turbopack)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📁 Project Structure

```
sali-app/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx        # Root layout & global providers
│   │   ├── page.tsx          # Home / landing page
│   │   └── globals.css       # Design system tokens (Tailwind v4)
│   ├── components/
│   │   └── global-navigation.tsx
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── Design.md                 # Full Apple-style design reference & tokens
├── claude.md                 # Project specification & agile roadmap
└── README.md
```

---

## 🎯 Design Principles

> **No shadows. No gradients. No clutter.**

1. **Depth through contrast** — `Gallery White` cards against `Studio Mist` backgrounds, separated by `1px` hairline borders
2. **Typography as hierarchy** — Strict SF Pro sizing scale with precise negative tracking
3. **Motion with purpose** — Every animation serves a functional cue, never decorative noise
4. **Product first** — Generous whitespace lets content breathe; no chrome competes with the work

---

## 🤝 Contributing

Contributions are welcome! Please follow the design system defined in [`Design.md`](./Design.md) for any UI changes.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <sub>Designed with precision. Built with care.</sub>
</div>

