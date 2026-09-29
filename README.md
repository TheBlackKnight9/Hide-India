# Hide Rajasthan — Lesser-Known Heritage & Culture Discovery Platform

> **Smart India Hackathon (SIH) Problem Statement:** SIH25130 – Student Innovation: Swadeshi for Atmanirbhar Bharat – Heritage & Culture  
> **Team:** Kunal Vaishnav, Anshul, Raghvendra Singh Rathore (JIET Jodhpur, Batch 2023–2027)

---

## 🏛️ Project Overview

**Hide Rajasthan** is an experiential full-stack web platform built with **Next.js 14 (App Router)** and **Tailwind CSS**. It is dedicated to uncovering, preserving, and digitally elevating Rajasthan’s lesser-known cultural heritage, subterranean stepwells, prehistoric caves, and vanishing oral traditions across all 10 major cultural regions (Jaipur, Jodhpur, Udaipur, Jaisalmer, Bikaner, Shekhawati, Bundi, Pushkar, Bharatpur, and Alwar).

The platform features:
- **Clean Photographic Cards**: Minimal, gallery-style presentation showcasing high-resolution monuments with unblemished photography.
- **Kumbhalgarh Fortress Hero**: Atmospheric Great Wall of Kumbhalgarh imagery with dual-tone typography and curated statistics.
- **Structured Single-line Navbar**: Logo with tagline, clean navigation pills (`Discover`, `Explore Atlas`, `Folk Fairs`, `Oral Lore`, `My Circuit`), and an amber **+ Contribute** button with live submission preview.
- **Visual Atlas & Dynamic Filter**: Instant toggle between Major Heritage and Hidden Gems, district filtering, search, and sort.
- **33 Real Verified Destinations**: High-resolution Wikimedia Commons and Unsplash photography, architectural notes, folklore, directions, and GI craft associations.
- **Zero-Config Vercel Architecture**: Built as a single unified full-stack application directly at the repository root (no nested backend/frontend directories).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS + Custom Heritage Color Palette (Desert Amber, Royal Saffron, Heritage Slate)
- **Icons**: Lucide React
- **ORM & Database**: Prisma ORM with PostgreSQL (`@prisma/client`)
- **Deployment Target**: Vercel (Root-level configuration with automatic `"postinstall": "prisma generate"`)

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use existing local database specified in `.env`)

### 2. Setup & Installation
```bash
# Clone or navigate to the project directory
cd "kunal project"

# Install dependencies (automatically runs `prisma generate`)
npm install

# (Optional) Seed the database with all 33 Rajasthan heritage destinations
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## ☁️ Vercel Deployment (Zero-Config)

This repository is structured specifically for **1-click Vercel deployment**:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete fullstack Hide Rajasthan Next.js app"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Import your GitHub repository.
   - Leave the **Root Directory** as `./` (default).
   - Add your Environment Variables under **Project Settings > Environment Variables**:
     - `DATABASE_URL` (e.g., Neon Postgres, Supabase, or any hosted PostgreSQL URL)
     - `GEMINI_API_KEY` (optional, for AI Concierge route)
   - Click **Deploy**. Vercel will run `postinstall: "prisma generate"` and `next build` automatically.

---

## 📁 Repository Structure

```text
├── prisma/
│   ├── schema.prisma       # Database schema for Places, Reviews, Events, Stories, Submissions
│   └── seed.js             # 33 curated Rajasthan heritage destinations
├── public/                 # Real Kumbhalgarh hero images and static assets
├── src/
│   ├── app/
│   │   ├── api/            # Next.js Full-Stack Route Handlers (Places, Reviews, Stats, Events, AI)
│   │   ├── contribute/     # Contribution page with live preview
│   │   ├── events/         # Desert melas and folk festivals
│   │   ├── explore/        # Rajasthan Visual Atlas
│   │   ├── place/[slug]/   # Monument dossiers with folklore & directions
│   │   ├── saved/          # Saved personal circuit with printable travelogue
│   │   ├── stories/        # Oral folklore reading room
│   │   ├── layout.js       # Root Layout with SavedContext and Navbar/Footer
│   │   ├── page.js         # Home page with Kumbhalgarh Hero and City Showcase
│   │   └── globals.css     # Tailwind and typography styles
│   ├── components/         # Navbar, PlaceCard, Footer, SwadeshiBanner, AIConciergeModal
│   ├── context/            # SavedContext for travel circuit bookmarks
│   ├── data/               # rajasthanFallbackPlaces.js (resilience fallback data)
│   └── lib/                # prisma.js singleton client
├── .gitignore              # Standard Next.js & Node ignore file
├── next.config.js          # Next.js configuration with remote image patterns
├── package.json            # Unified dependencies, scripts, and Vercel postinstall hook
└── tailwind.config.js      # Heritage theme palette and typography configuration
```
