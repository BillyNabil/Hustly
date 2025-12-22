<p align="center">
  <img src="public/web-app-manifest-512x512.png" alt="Hustly Logo" width="150" height="150" />
</p>

<h1 align="center">🚀 Hustly</h1>

<p align="center">
  <strong>Your All-in-One Productivity & Hustle Companion</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.1-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/platform-Windows%20|%20macOS%20|%20Linux%20|%20Web%20|%20PWA-orange.svg" alt="Platform" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</p>

---

## 🌟 Overview

**Hustly** is a premium, feature-rich productivity application designed for entrepreneurs, freelancers, and ambitious hustlers. Built with modern technologies and featuring a stunning glassmorphism UI, Hustly helps you manage your ideas, track your finances, build habits, and stay motivated on your journey to success.

> 💡 *"Your empire is waiting. Let Hustly help you build it."*

---

## ✨ Features

### 📋 **Idea Management (Kanban Board)**
- Drag-and-drop Kanban board with customizable columns
- Status tracking: Backlog → In Progress → Done
- Priority levels and category tagging
- Quick actions and bulk operations

### 💰 **Finance Tracker**
- Track income and expenses across multiple accounts
- Beautiful charts and analytics
- Budget management and goal setting
- Multi-currency support

### 🎯 **Weekly Goals**
- Set and track weekly objectives
- Progress visualization with animated indicators
- Smart goal suggestions based on your habits
- Deadline reminders

### 📈 **Habits Tracker**
- Build positive habits with streak tracking
- Daily/Weekly/Monthly habit schedules
- Streak celebrations and recovery system
- Visual progress calendar

### 🏆 **Achievements & Gamification**
- Unlock achievements as you progress
- XP system and leveling
- Leaderboards for competitive motivation
- Daily challenges with rewards

### 🤖 **Ghost CEO AI Chat**
- AI-powered business advisor
- Get insights and recommendations
- Brainstorm ideas with your personal CEO
- Powered by Google Gemini

### 🖼️ **Vision Board**
- Create visual goal boards
- Drag-and-drop image placement
- Customizable layouts and themes
- Export and share your vision

### 📊 **Analytics Dashboard**
- Comprehensive productivity metrics
- Visual data representation
- Trend analysis and insights
- Customizable date ranges

### 🔔 **Smart Notifications**
- Desktop and push notifications
- Customizable alert settings
- Focus mode with priority filtering
- Notification history

### 🌍 **Multi-language Support**
- English and Indonesian (Bahasa Indonesia)
- Easy language switching
- Localized UI components

### 🎨 **Premium UI/UX**
- Glassmorphism design with blur effects
- Dark mode optimized
- Smooth animations powered by Framer Motion
- Responsive design for all devices

---

## 🖥️ Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| 🪟 Windows | ✅ Ready | Native desktop app via Tauri |
| 🍎 macOS | ✅ Ready | Native desktop app via Tauri |
| 🐧 Linux | ✅ Ready | Native desktop app via Tauri |
| 🌐 Web | ✅ Ready | PWA with offline support |
| 📱 Android | 🚧 Coming Soon | Via Tauri 2.0 |
| 🍏 iOS | 🚧 Coming Soon | Via Tauri 2.0 |

---

## 📥 Installation

### Option 1: Download Pre-built Binaries

#### Windows
```
📦 Hustly_0.1.1_x64-setup.exe (2.4 MB)
```
Download the latest release from the [Releases](#releases) section.

### Option 2: Build from Source

#### Prerequisites
- **Node.js** 18.x or later
- **npm** or **yarn**
- **Rust** (for Tauri desktop builds)
- **Git**

#### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hustly.git
   cd hustly/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   # Web build
   npm run build
   
   # Desktop build (requires Rust)
   npm run tauri:build
   ```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **Framer Motion** | Animation library |
| **Lucide React** | Beautiful icon set |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service |
| **PostgreSQL** | Relational database |
| **Row Level Security** | Data protection |

### Desktop & Mobile
| Technology | Purpose |
|------------|---------|
| **Tauri 2.0** | Cross-platform desktop apps |
| **Rust** | Native performance |
| **PWA** | Progressive Web App support |

### AI Integration
| Technology | Purpose |
|------------|---------|
| **Google Gemini** | AI-powered Ghost CEO chat |
| **Generative AI SDK** | Natural language processing |

---

## � Screenshots

<p align="center">
  <img src="public/screenshots/preview.png" alt="Hustly App Preview" width="100%" />
</p>

### 🎯 Main Dashboard
The central hub for all your hustle activities with real-time stats and quick access to all features.

<p align="center">
  <img src="public/screenshots/dashboard-preview.png" alt="Dashboard" width="100%" />
</p>

### 📋 Idea Management (Kanban Board)
<table>
  <tr>
    <td width="50%">
      <img src="public/screenshots/kanban-board.png" alt="Kanban Board" width="100%" />
      <p align="center"><em>Organize ideas with drag-and-drop Kanban</em></p>
    </td>
    <td width="50%">
      <img src="public/screenshots/kanban-detail.png" alt="Task Details" width="100%" />
      <p align="center"><em>Detailed task management with priorities</em></p>
    </td>
  </tr>
</table>

### 💰 Finance Tracker
<table>
  <tr>
    <td width="50%">
      <img src="public/screenshots/finance-overview.png" alt="Finance Overview" width="100%" />
      <p align="center"><em>Track income and expenses</em></p>
    </td>
    <td width="50%">
      <img src="public/screenshots/finance-charts.png" alt="Financial Charts" width="100%" />
      <p align="center"><em>Beautiful analytics and insights</em></p>
    </td>
  </tr>
</table>

### 🎯 Goals & Habits
<table>
  <tr>
    <td width="50%">
      <img src="public/screenshots/weekly-goals.png" alt="Weekly Goals" width="100%" />
      <p align="center"><em>Set and track weekly objectives</em></p>
    </td>
    <td width="50%">
      <img src="public/screenshots/habits-tracker.png" alt="Habits Tracker" width="100%" />
      <p align="center"><em>Build consistency with streak tracking</em></p>
    </td>
  </tr>
</table>

### 🤖 Ghost CEO AI Chat
<p align="center">
  <img src="public/screenshots/ghost-ceo-chat.png" alt="AI Chat" width="70%" />
  <br/>
  <em>Your personal AI business advisor powered by Google Gemini</em>
</p>

### 🏆 Achievements & Leaderboard
<table>
  <tr>
    <td width="50%">
      <img src="public/screenshots/achievements.png" alt="Achievements" width="100%" />
      <p align="center"><em>Unlock achievements as you progress</em></p>
    </td>
    <td width="50%">
      <img src="public/screenshots/leaderboard.png" alt="Leaderboard" width="100%" />
      <p align="center"><em>Compete with other hustlers</em></p>
    </td>
  </tr>
</table>

### 🖼️ Vision Board & Analytics
<table>
  <tr>
    <td width="50%">
      <img src="public/screenshots/vision-board.png" alt="Vision Board" width="100%" />
      <p align="center"><em>Visualize your goals and dreams</em></p>
    </td>
    <td width="50%">
      <img src="public/screenshots/analytics.png" alt="Analytics Dashboard" width="100%" />
      <p align="center"><em>Comprehensive productivity metrics</em></p>
    </td>
  </tr>
</table>

### 📱 Responsive Design
<p align="center">
  <img src="public/screenshots/mobile-responsive.png" alt="Mobile View" width="50%" />
  <br/>
  <em>Fully responsive design works on all devices</em>
</p>

> **📝 Screenshots Note:** 
> 
> The application screenshots referenced above will be captured and added to the repository soon. For now, you can:
> - **Try it yourself**: Run `npm run dev` and explore the app at `http://localhost:3000`
> - **Capture screenshots**: Follow the guide in [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) to capture your own
> - **Contribute**: Help us by adding quality screenshots via pull request!
> 
> The UI features a stunning glassmorphism design with dark mode theme, smooth animations, and responsive layouts that work beautifully on all devices.

---

## �📁 Project Structure

```
hustly/web/
├── 📂 public/                 # Static assets
│   ├── favicon.ico
│   ├── manifest.json
│   └── sw.js                  # Service Worker for PWA
│
├── 📂 src/
│   ├── 📂 app/                # Next.js App Router pages
│   │   ├── 📂 achievements/   # Achievements page
│   │   ├── 📂 analytics/      # Analytics dashboard
│   │   ├── 📂 api/            # API routes
│   │   ├── 📂 challenges/     # Daily challenges
│   │   ├── 📂 chat/           # Ghost CEO chat
│   │   ├── 📂 finance/        # Finance tracker
│   │   ├── 📂 goals/          # Weekly goals
│   │   ├── 📂 habits/         # Habits tracker
│   │   ├── 📂 ideas/          # Kanban board
│   │   ├── 📂 landing/        # Landing page
│   │   ├── 📂 leaderboard/    # Community leaderboard
│   │   ├── 📂 login/          # Authentication
│   │   ├── 📂 notifications/  # Notification center
│   │   ├── 📂 register/       # User registration
│   │   ├── 📂 settings/       # App settings
│   │   ├── 📂 vision/         # Vision board
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard
│   │
│   ├── 📂 components/         # Reusable components
│   │   ├── AchievementsSystem.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── AppShell.tsx
│   │   ├── DailyChallenges.tsx
│   │   ├── FinanceTracker.tsx
│   │   ├── GhostCEOChat.tsx
│   │   ├── HabitsTracker.tsx
│   │   ├── HeaderBar.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── MobileNav.tsx
│   │   ├── NotificationsCenter.tsx
│   │   ├── PWAProvider.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SpotifyPlayer.tsx
│   │   ├── TitleBar.tsx
│   │   ├── VisionBoard.tsx
│   │   └── WeeklyGoals.tsx
│   │
│   └── 📂 lib/                # Utilities & services
│       ├── animations.ts      # Framer Motion variants
│       ├── auth-context.tsx   # Authentication context
│       ├── database.types.ts  # TypeScript types
│       ├── i18n.ts            # Internationalization
│       ├── language-context.tsx
│       ├── supabase-service.ts # Database operations
│       ├── supabaseClient.ts
│       ├── theme-context.tsx  # Theme management
│       └── utils.ts           # Helper functions
│
├── 📂 src-tauri/              # Tauri desktop app
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── 📂 icons/              # App icons
│
├── 📂 supabase/               # Database migrations
│   └── 📂 migrations/
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗃️ Database Schema

Hustly uses **Supabase** with **PostgreSQL** as its database. Key tables include:

| Table | Description |
|-------|-------------|
| `profiles` | User profiles with stats and preferences |
| `ideas` | Kanban board items |
| `goals` | Weekly/monthly goals |
| `habits` | Habit definitions and schedules |
| `habit_logs` | Habit completion tracking |
| `transactions` | Financial transactions |
| `achievements` | Available achievements |
| `user_achievements` | Unlocked achievements |
| `notifications` | User notifications |
| `vision_boards` | Vision board data |
| `leaderboard` | Community rankings |

All tables are protected with **Row Level Security (RLS)** policies.

---

## 🔐 Authentication

Hustly supports multiple authentication methods via Supabase Auth:

- ✉️ **Email/Password** - Traditional registration
- 🔗 **Magic Link** - Passwordless email login
- 🌐 **OAuth Providers** - Google, GitHub, Discord (configurable)

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: #facc15;      /* Electric Yellow */
--accent: #f97316;       /* Vibrant Orange */
--secondary: #6366f1;    /* Indigo */

/* Semantic Colors */
--success: #22c55e;      /* Green */
--warning: #eab308;      /* Amber */
--error: #ef4444;        /* Red */

/* Neutrals */
--background: #0a0a0a;   /* Deep Black */
--card: #1a1a1a;         /* Dark Gray */
--foreground: #fafafa;   /* Almost White */
```

### Typography

- **Font Family**: Inter, system-ui
- **Headings**: Bold with gradient backgrounds
- **Body**: Regular weight for readability

### UI Components

- **Glass Panels**: Backdrop blur with subtle borders
- **Cards**: Elevated with hover effects
- **Buttons**: Gradient backgrounds with micro-animations
- **Inputs**: Dark theme with focus rings

---

## 🚀 Releases

### v0.1.1 (Latest)
**Released:** December 22, 2024

#### 📦 Downloads
| Platform | Download | Size |
|----------|----------|------|
| Windows (x64) | [Hustly_0.1.1_x64-setup.exe](./src-tauri/target/release/bundle/nsis/Hustly_0.1.1_x64-setup.exe) | ~2.4 MB |
| Windows (MSI) | [Hustly_0.1.1_x64_en-US.msi](./src-tauri/target/release/bundle/msi/) | ~2.3 MB |

#### ✨ What's New
- 🐛 Fixed chunk loading issues in production build
- 🎨 Improved glassmorphism effects
- 🌐 Added Indonesian language support
- 🔔 Enhanced notification system
- 📱 Better mobile responsiveness
- ⚡ Performance optimizations

---

### v0.1.0
**Released:** December 20, 2024

#### ✨ Initial Release
- 📋 Kanban Board for idea management
- 💰 Finance Tracker
- 🎯 Weekly Goals
- 📈 Habits Tracker with streaks
- 🏆 Achievements system
- 🤖 Ghost CEO AI Chat
- 🖼️ Vision Board
- 📊 Analytics Dashboard
- 🔔 Notification Center
- 🌍 Multi-language support (EN/ID)
- 🎨 Premium glassmorphism UI
- 🖥️ Cross-platform desktop app

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tauri](https://tauri.app/) - Build desktop apps
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

<p align="center">
  <strong>Built with 💛 by the Hustly Team</strong>
</p>

<p align="center">
  <a href="https://twitter.com/hustlyapp">Twitter</a> •
  <a href="https://discord.gg/hustly">Discord</a> •
  <a href="https://hustly.app">Website</a>
</p>
