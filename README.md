<p align="center">
  <img src="public/web-app-manifest-512x512.png" alt="Hustly Logo" width="150" height="150" />
</p>

<h1 align="center">🚀 Hustly - The Hustler's OS</h1>

<p align="center">
  <strong>Manage your empire. Track habits. Achieve goals. Powered by AI.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-documentation">Documentation</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.2-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-14-black.svg" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tauri-2.0-24c8db.svg" alt="Tauri" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178c6.svg" alt="TypeScript" />
</p>

---

## 🌟 Overview

**Hustly** adalah aplikasi produktivitas all-in-one yang dirancang untuk entrepreneurs, freelancers, dan para hustler ambisius. Dibangun dengan teknologi modern dan UI glassmorphism yang stunning, Hustly membantu kamu mengelola ide, melacak keuangan, membangun kebiasaan, dan tetap termotivasi dalam perjalanan menuju kesuksesan.

> 💡 *"Your empire is waiting. Let Hustly help you build it."*

### ✨ Highlights

- 🎨 **Premium Glassmorphism UI** - Dark theme dengan efek blur yang memukau
- 🖥️ **Cross-Platform** - Web, PWA, dan Desktop (Windows/macOS/Linux)
- 🤖 **AI-Powered** - Ghost CEO chat dengan Google Gemini
- 🌍 **Multi-Language** - Bahasa Indonesia & English
- ⚡ **Real-time Sync** - Data tersinkronisasi dengan Supabase
- 🏆 **Gamification** - Achievements, XP, dan Leaderboard

---

## 📋 Features

### 🎯 Productivity Suite

| Feature | Deskripsi |
|---------|-----------|
| **📋 Kanban Board** | Drag-and-drop board untuk mengelola ide dan proyek dengan status Backlog → In Progress → Done |
| **🎯 Weekly Goals** | Set dan track target mingguan dengan progress visualization |
| **📅 Schedule** | Time blocking dan perencanaan jadwal harian |
| **📈 Habits Tracker** | Build positive habits dengan streak tracking dan visual calendar |

### 💰 Finance & Analytics

| Feature | Deskripsi |
|---------|-----------|
| **💳 Finance Tracker** | Track income & expenses dengan beautiful charts |
| **📊 Analytics Dashboard** | Comprehensive productivity metrics dan trend analysis |
| **📈 Overview** | Bird's eye view semua aktivitas dan progress kamu |

### 🏆 Gamification & Social

| Feature | Deskripsi |
|---------|-----------|
| **🏆 Achievements** | Unlock achievements saat mencapai milestones |
| **⚔️ Daily Challenges** | Tantangan harian dengan rewards |
| **🏅 Leaderboard** | Compete dengan hustlers lainnya |
| **📣 Notifications** | Smart notifications dengan push support |

### 🤖 AI & Visualization

| Feature | Deskripsi |
|---------|-----------|
| **🤖 Ghost CEO** | AI business advisor powered by Google Gemini |
| **🖼️ Vision Board** | Visualisasi goals dan dreams |
| **🎨 Custom Themes** | Personalisasi tampilan sesuai preferensi |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x atau lebih baru
- **npm** atau **yarn**
- **Rust** (untuk build desktop dengan Tauri)

### Development

```bash
# Clone repository
git clone https://github.com/yourusername/hustly.git
cd hustly/web

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Supabase dan Gemini API key kamu

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Desktop Development (Tauri)

```bash
# Run Tauri development
npm run tauri:dev

# Build desktop app
npm run tauri:build
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | React framework dengan App Router |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Framer Motion** | 12.x | Animation library |
| **Lucide React** | Latest | Icon library |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service (Auth, Database, Realtime) |
| **PostgreSQL** | Relational database |
| **Row Level Security** | Data protection per user |

### Desktop & Mobile
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tauri** | 2.x | Cross-platform desktop apps |
| **Rust** | Latest | Native performance |
| **PWA** | - | Progressive Web App dengan offline support |

### AI Integration
| Technology | Purpose |
|------------|---------|
| **Google Gemini** | AI chat untuk Ghost CEO |
| **@google/genai** | Generative AI SDK |

---

## 📥 Installation

### Option 1: Download Pre-built (Windows)

Download installer terbaru dari [Releases](./RELEASES.md):

| Version | Installer | Size |
|---------|-----------|------|
| v0.1.2 | `Hustly_0.1.2_x64-setup.exe` | ~2.4 MB |
| v0.1.2 | `Hustly_0.1.2_x64_en-US.msi` | ~2.3 MB |

### Option 2: Build from Source

```bash
# Clone dan install
git clone https://github.com/yourusername/hustly.git
cd hustly/web
npm install

# Environment variables
cp .env.example .env.local
```

**Required Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

**Build Commands:**
```bash
# Web production build
npm run build

# Desktop build (Windows/macOS/Linux)
npm run tauri:build
```

---

## 📁 Project Structure

```
hustly/web/
├── public/                    # Static assets
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── icons/                 # App icons
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Dashboard (home)
│   │   ├── achievements/      # 🏆 Achievements page
│   │   ├── analytics/         # 📊 Analytics dashboard
│   │   ├── api/               # API routes
│   │   ├── challenges/        # ⚔️ Daily challenges
│   │   ├── chat/              # 🤖 Ghost CEO chat
│   │   ├── finance/           # 💰 Finance tracker
│   │   ├── goals/             # 🎯 Weekly goals
│   │   ├── habits/            # 📈 Habits tracker
│   │   ├── ideas/             # 📋 Kanban board
│   │   ├── landing/           # Landing page
│   │   ├── leaderboard/       # 🏅 Leaderboard
│   │   ├── login/             # Auth login
│   │   ├── notifications/     # 🔔 Notification center
│   │   ├── overview/          # Overview dashboard
│   │   ├── register/          # Auth register
│   │   ├── schedule/          # 📅 Schedule/time blocking
│   │   ├── settings/          # ⚙️ App settings
│   │   └── vision/            # 🖼️ Vision board
│   │
│   ├── components/            # React components
│   │   ├── AppShell.tsx       # Main app layout
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── HeaderBar.tsx      # Top header
│   │   ├── MobileNav.tsx      # Mobile navigation
│   │   └── ...                # Feature components
│   │
│   └── lib/                   # Utilities
│       ├── supabase-service.ts    # Database operations
│       ├── auth-context.tsx       # Auth state
│       ├── language-context.tsx   # i18n
│       ├── theme-context.tsx      # Theme management
│       └── animations.ts          # Framer Motion variants
│
├── src-tauri/                 # Tauri desktop app
│   ├── tauri.conf.json        # Tauri configuration
│   ├── src/                   # Rust source
│   └── icons/                 # Desktop icons
│
├── supabase/                  # Database
│   ├── migrations/            # SQL migrations
│   └── functions/             # Edge functions
│
├── docs/                      # Documentation
│   ├── PUSH_NOTIFICATIONS.md
│   └── SCREENSHOTS.md
│
└── package.json
```

---

## 🗃️ Database Schema

Hustly menggunakan **Supabase** dengan **PostgreSQL**. Key tables:

| Table | Description |
|-------|-------------|
| `profiles` | User profiles, stats, preferences |
| `ideas` | Kanban board items |
| `goals` | Weekly/monthly goals |
| `habits` | Habit definitions |
| `habit_logs` | Habit completion tracking |
| `transactions` | Financial transactions |
| `achievements` | Achievement definitions |
| `user_achievements` | Unlocked achievements |
| `notifications` | User notifications |
| `push_subscriptions` | PWA push subscriptions |

Semua tables dilindungi dengan **Row Level Security (RLS)** policies.

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#d4af37` | Gold/Electric Yellow |
| Accent | `#f97316` | Orange |
| Secondary | `#6366f1` | Indigo |
| Background | `#0a0a0a` | Deep Black |
| Card | `#1a1a1a` | Dark Gray |

### Typography

- **Font**: Outfit (Google Fonts)
- **Style**: Modern, clean, readable

### UI Components

- **Glassmorphism** - Backdrop blur dengan subtle borders
- **Cards** - Elevated dengan hover effects
- **Buttons** - Gradient backgrounds dengan micro-animations
- **Dark Mode First** - Optimized untuk dark theme

---

## 🖥️ Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| 🌐 Web Browser | ✅ Ready | Chrome, Firefox, Safari, Edge |
| 📱 PWA | ✅ Ready | Installable dengan offline support |
| 🪟 Windows | ✅ Ready | Native via Tauri 2.0 |
| 🍎 macOS | ✅ Ready | Native via Tauri 2.0 |
| 🐧 Linux | ✅ Ready | Native via Tauri 2.0 |
| 📱 Android | 🚧 Soon | Via Tauri 2.0 |
| 🍏 iOS | 🚧 Soon | Via Tauri 2.0 |

---

## 📚 Documentation

- [Push Notifications Setup](./docs/PUSH_NOTIFICATIONS.md)
- [Screenshots Guide](./docs/SCREENSHOTS.md)
- [Release Notes](./RELEASES.md)

---

## 🚀 Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Desktop (Tauri)
npm run tauri:dev    # Start Tauri dev
npm run tauri:build  # Build desktop app
```

---

## 🔐 Authentication

Hustly mendukung beberapa metode autentikasi via Supabase Auth:

- ✉️ **Email/Password** - Registrasi tradisional
- 🔗 **Magic Link** - Passwordless email login
- 🌐 **OAuth** - Google, GitHub, Discord (configurable)

---

## 🤝 Contributing

Contributions welcome! 

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test changes thoroughly
- Update documentation as needed

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tauri](https://tauri.app/)
- [Supabase](https://supabase.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini](https://ai.google.dev/)

---

<p align="center">
  <strong>Built with 💛 for Hustlers</strong>
</p>

<p align="center">
  Made in Indonesia 🇮🇩
</p>
