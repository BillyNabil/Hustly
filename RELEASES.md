# 📦 Hustly Releases

All notable changes and releases of Hustly are documented here.

---

## 🚀 Latest Release

### v0.1.3 - Major UI Update
**📅 Released:** December 23, 2025

#### Downloads

| Platform | Architecture | Installer | Size | Notes |
|----------|--------------|-----------|------|-------|
| Windows | x64 | [Hustly_0.1.2_x64-setup.exe](./src-tauri/target/release/bundle/nsis/Hustly_0.1.2_x64-setup.exe) | 2.4 MB | NSIS Installer (Recommended) |
| Windows | x64 | [Hustly_0.1.2_x64_en-US.msi](./src-tauri/target/release/bundle/msi/Hustly_0.1.2_x64_en-US.msi) | 2.3 MB | MSI Package |

#### ✨ New Features
- **Schedule & Time Blocking** - New page for daily schedule management with drag-and-drop time blocks
- **Overview Dashboard** - Bird's eye view of all your productivity metrics
- **Push Notifications** - PWA push notification support with Supabase Edge Functions
- **Visualizer Components** - Beautiful animated visualizers for all pages (Dashboard, Achievements, Analytics, Challenges, Chat, Finance, Goals, Habits, Ideas, Leaderboard, Schedule, Settings, Vision)
- **Modern Background** - New animated gradient background component
- **Auth Background** - Animated background for login/register pages
- **Notification Permission Prompt** - Smart prompt for enabling notifications

#### 🎨 UI/UX Improvements
- Refined glassmorphism effects across all pages
- New animated input components
- Better page transitions and animations
- Improved responsive design
- Updated README with complete documentation

#### 🐛 Bug Fixes
- Fixed missing `X` icon import in KanbanBoard component
- Fixed various TypeScript type issues

#### 📦 New Files Added
- 20+ new visualizer and UI components
- Push notification service and edge functions
- Time blocking database migrations
- Display name and daily challenges migrations

---

### v0.1.2 - UI Fix
**📅 Released:** December 22, 2024

#### Downloads

| Platform | Architecture | Installer | Size | Notes |
|----------|--------------|-----------|------|-------|
| Windows | x64 | [Hustly_0.1.2_x64-setup.exe](./src-tauri/target/release/bundle/nsis/Hustly_0.1.2_x64-setup.exe) | 2.4 MB | NSIS Installer (Recommended) |
| Windows | x64 | [Hustly_0.1.2_x64_en-US.msi](./src-tauri/target/release/bundle/msi/Hustly_0.1.2_x64_en-US.msi) | 2.3 MB | MSI Package |

#### 🐛 Bug Fixes
- **Fixed:** Notification bell icon overlapping window controls (minimize, maximize, close)
- **Improved:** Better positioning for Tauri desktop environment

---

### v0.1.1 - Stability Update
**📅 Released:** December 22, 2024

#### Downloads

| Platform | Architecture | Installer | Size | Notes |
|----------|--------------|-----------|------|-------|
| Windows | x64 | [Hustly_0.1.1_x64-setup.exe](./src-tauri/target/release/bundle/nsis/Hustly_0.1.1_x64-setup.exe) | 2.4 MB | NSIS Installer |
| Windows | x64 | [Hustly_0.1.1_x64_en-US.msi](./src-tauri/target/release/bundle/msi/Hustly_0.1.1_x64_en-US.msi) | 2.3 MB | MSI Package |

#### 🐛 Bug Fixes
- **Fixed:** "Loading chunk failed" error when running production build
- **Fixed:** Chunk hash mismatch between cached and new builds
- **Fixed:** PWA service worker caching issues
- **Fixed:** Chrome extension request handling in service worker

#### ⚡ Performance Improvements
- Optimized Next.js static export configuration
- Improved chunk splitting for better loading
- Enhanced GPU acceleration for animations
- Reduced initial bundle size

#### 🎨 UI/UX Improvements
- Refined glassmorphism effects
- Better sidebar collapse animations
- Improved mobile navigation transitions
- Enhanced button hover states

---

## 📜 Changelog

### v0.1.0 - Initial Release
**📅 Released:** December 20, 2024

This is the first public release of Hustly, featuring a complete productivity suite.

#### ✨ Features

##### Core Modules
- **Dashboard** - Overview of stats, alerts, and recent activity
- **Ideas (Kanban Board)** - Drag-and-drop task management
- **Finance Tracker** - Income/expense tracking with analytics
- **Weekly Goals** - Set and track weekly objectives
- **Habits Tracker** - Build habits with streak tracking
- **Vision Board** - Visual goal board creation

##### AI & Social
- **Ghost CEO Chat** - AI-powered business advisor (Google Gemini)
- **Leaderboard** - Community rankings and competition
- **Achievements** - Gamification with unlockable badges
- **Daily Challenges** - Daily tasks for XP rewards

##### System Features
- **Authentication** - Email/password and OAuth support
- **Notifications** - Desktop and push notifications
- **Settings** - Theme, language, and preference management
- **Multi-language** - English and Indonesian support

##### Design
- Premium glassmorphism UI
- Dark mode optimized
- Responsive design (desktop, tablet, mobile)
- Smooth animations with Framer Motion

##### Platform Support
- Windows desktop app (x64)
- macOS desktop app (Intel & Apple Silicon)
- Linux desktop app
- Progressive Web App (PWA)
- Web browser access

---

## 🔮 Roadmap

### v0.2.0 (Planned)
- [ ] Android app release
- [ ] iOS app release
- [ ] Team collaboration features
- [ ] Shared workspaces
- [ ] Calendar integration
- [ ] Pomodoro timer

### v0.3.0 (Future)
- [ ] API for third-party integrations
- [ ] Zapier/Make integration
- [ ] Advanced analytics
- [ ] Custom themes
- [ ] Plugin system

---

## 📋 Installation Instructions

### Windows (NSIS Installer)
1. Download `Hustly_0.1.1_x64-setup.exe`
2. Run the installer
3. Follow the installation wizard
4. Launch Hustly from Start Menu or Desktop

### Windows (MSI Package)
1. Download `Hustly_0.1.1_x64_en-US.msi`
2. Run the MSI package
3. Accept the license agreement
4. Choose installation location
5. Complete installation

### Web (PWA)
1. Visit [hustly.app](https://hustly.app) (or your deployed URL)
2. Click "Install" button in browser address bar
3. Confirm installation
4. Access from your desktop or app drawer

---

## 🔧 System Requirements

### Windows
- **OS:** Windows 10 (version 1803+) or Windows 11
- **Architecture:** x64 (64-bit)
- **RAM:** 4 GB minimum, 8 GB recommended
- **Storage:** 100 MB free space
- **Display:** 1366x768 minimum resolution

### macOS
- **OS:** macOS 10.15 (Catalina) or later
- **Architecture:** Intel or Apple Silicon (M1/M2)
- **RAM:** 4 GB minimum
- **Storage:** 100 MB free space

### Linux
- **Distribution:** Ubuntu 18.04+, Debian 10+, Fedora 32+, or equivalent
- **Dependencies:** WebKit2GTK, GTK3
- **RAM:** 4 GB minimum
- **Storage:** 100 MB free space

### Web Browser
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🔐 Security

### Code Signing
- Windows installers are signed with a verified certificate
- macOS builds are notarized by Apple

### Data Protection
- All data stored in Supabase with Row Level Security (RLS)
- HTTPS encryption for all API communications
- Local data encrypted at rest (desktop apps)

---

## 📞 Support

If you encounter any issues:

1. **Check Issues:** Look for existing issues on GitHub
2. **Open Issue:** Create a new issue with detailed information
3. **Community:** Join our Discord for real-time help

---

## 🙏 Credits

Special thanks to all contributors and the open-source community!

---

<p align="center">
  <strong>Made with 💛 for hustlers everywhere</strong>
</p>
