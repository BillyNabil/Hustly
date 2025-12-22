# How to Capture Screenshots for Hustly

This guide will help you capture high-quality screenshots for the Hustly documentation.

## Prerequisites

- Application running on `http://localhost:3000`
- Browser: Chrome, Edge, or Firefox (recommended for DevTools)
- Screen resolution: 1920x1080 or higher

## Screenshot List

### Required Screenshots

1. **preview.png** (Hero/Banner image)
   - Full landing page with hero section
   - Include the "Build Your Empire" heading
   - Show stats and feature cards

2. **dashboard-preview.png**
   - Main dashboard after login
   - Show sidebar, main content area, and stats
   - Include recent activity and quick actions

3. **kanban-board.png**
   - Ideas page (`/ideas`)
   - Show at least 3 columns (Backlog, In Progress, Done)
   - Include multiple cards with different priorities

4. **kanban-detail.png**
   - Modal or detail view of a specific idea/task
   - Show form fields, priority selector, category

5. **finance-overview.png**
   - Finance tracker page (`/finance`)
   - Show accounts list, recent transactions
   - Include income/expense summary

6. **finance-charts.png**
   - Finance page with charts visible
   - Display pie charts, bar charts, or line graphs
   - Show time period selector

7. **weekly-goals.png**
   - Goals page (`/goals`)
   - Display current week's goals
   - Show progress bars and completion status

8. **habits-tracker.png**
   - Habits page (`/habits`)
   - Show habit list with streaks
   - Include calendar view if possible

9. **ghost-ceo-chat.png**
   - Chat page (`/chat`)
   - Show conversation with AI
   - Include input field and previous messages

10. **achievements.png**
    - Achievements page (`/achievements`)
    - Display unlocked and locked achievements
    - Show XP bar and level

11. **leaderboard.png**
    - Leaderboard page (`/leaderboard`)
    - Show user rankings
    - Include stats columns

12. **vision-board.png**
    - Vision board page (`/vision`)
    - Display vision board with images
    - Show editing tools if applicable

13. **analytics.png**
    - Analytics page (`/analytics`)
    - Show charts and metrics
    - Include date range selector

14. **mobile-responsive.png**
    - Mobile view (375px width)
    - Show responsive navigation
    - Capture mobile-friendly layout

## Capture Methods

### Method 1: Browser DevTools (Recommended)

1. **Open DevTools**: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Opt+I` (Mac)

2. **Open Device Toolbar**: Press `Ctrl+Shift+M` (Windows/Linux) / `Cmd+Shift+M` (Mac)

3. **Set Resolution**: 
   - Desktop: 1920x1080
   - Tablet: 768x1024
   - Mobile: 375x667

4. **Capture Screenshot**:
   - Open Command Menu: `Ctrl+Shift+P` (Windows/Linux) / `Cmd+Shift+P` (Mac)
   - Type "screenshot"
   - Choose "Capture full size screenshot" or "Capture screenshot"

5. **Save to**: `public/screenshots/`

### Method 2: Windows Snipping Tool

1. Open Snipping Tool or Snip & Sketch (`Win+Shift+S`)
2. Select area to capture
3. Save to `public/screenshots/`

### Method 3: Playwright (Automated)

```bash
# Install Playwright if not already installed
npm install -D @playwright/test

# Create a screenshot script
npx playwright codegen http://localhost:3000
```

## Screenshot Guidelines

### Quality Requirements

- **Resolution**: Minimum 1920x1080 for desktop screenshots
- **Format**: PNG (for transparency and quality)
- **File Size**: Under 500KB (use compression if needed)
- **Theme**: Dark mode enabled
- **UI State**: 
  - Remove browser chrome (address bar, bookmarks)
  - Hide personal information
  - Use realistic sample data
  - Ensure proper loading states (no spinners)

### Naming Convention

Use lowercase with hyphens:
- ✅ `dashboard-preview.png`
- ✅ `kanban-board.png`
- ❌ `Dashboard_Preview.PNG`
- ❌ `kanban board.png`

### Content Guidelines

1. **Use Realistic Data**:
   - Actual task names, not "Task 1", "Task 2"
   - Real-looking financial amounts
   - Meaningful goal descriptions

2. **Show Features in Action**:
   - Highlight interactive elements
   - Show hover states where relevant
   - Demonstrate the glassmorphism effects

3. **Consistency**:
   - Same user profile across screenshots
   - Consistent date/time
   - Uniform styling and theme

## Image Optimization

After capturing, optimize images:

```bash
# Using ImageOptim (Mac) or TinyPNG (Web)
# Or use sharp via npm:

npm install -g sharp-cli

sharp -i public/screenshots/dashboard-preview.png -o public/screenshots/dashboard-preview.png -q 80
```

## Troubleshooting

### Issue: Screenshots look different than live app
- Clear browser cache (`Ctrl+Shift+Delete`)
- Ensure CSS/JS fully loaded
- Wait for animations to complete

### Issue: File size too large
- Use PNG optimization tools
- Reduce resolution slightly (e.g., 1440p instead of 1080p)
- Remove unnecessary UI elements

### Issue: Text appears blurry
- Use browser zoom at 100%
- Enable high-DPI rendering in browser settings
- Capture on a high-resolution display

## After Capturing

1. **Review**: Check each screenshot for quality and content
2. **Commit**: Add to git
   ```bash
   git add public/screenshots/
   git commit -m "Add application screenshots"
   ```
3. **Verify**: Check README renders correctly on GitHub

## Quick Checklist

- [ ] Application running in dark mode
- [ ] Browser DevTools open (Device Toolbar)
- [ ] Resolution set correctly
- [ ] Sample data populated
- [ ] All pages captured
- [ ] Images optimized
- [ ] Files named correctly
- [ ] Screenshots committed to git

---

**Need Help?** Open an issue on GitHub or contact the maintainers.
