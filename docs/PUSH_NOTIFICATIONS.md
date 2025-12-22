# Push Notification Setup Guide

## Overview
Hustly supports push notifications across all platforms:
- **Web Browser** (Chrome, Firefox, Edge, Safari)
- **PWA** (Progressive Web App installed on desktop/mobile)
- **Android** (via Tauri APK or PWA)

## How It Works

### Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   App Frontend  │───>│ Supabase Edge    │───>│   Web Push API  │
│  (subscribes)   │    │   Function       │    │   (notifications)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                      │
        └──────────┬───────────┘
                   ▼
        ┌──────────────────┐
        │ Supabase Database │
        │ (subscriptions)   │
        └──────────────────┘
```

### Notification Types
- **Achievement** 🏆 - When you unlock achievements
- **Reminder** 🕐 - Habit reminders, task reminders
- **Deadline** ⚠️ - Approaching deadlines
- **Briefing** 🌅 - Morning briefings
- **Challenge** 🎯 - Challenge updates
- **System** 🔔 - System messages

## Setup Instructions

### 1. Generate VAPID Keys
VAPID (Voluntary Application Server Identification) keys are required for Web Push API.

Option A: Using web-push npm package:
```bash
npx web-push generate-vapid-keys
```

Option B: Using online generator:
Visit https://vapidkeys.com/

### 2. Configure Environment Variables

Add to your `.env.local`:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key_here
```

### 3. Configure Supabase Edge Function Secrets

In Supabase Dashboard > Edge Functions > Secrets, add:
- `VAPID_PUBLIC_KEY` - Your VAPID public key
- `VAPID_PRIVATE_KEY` - Your VAPID private key

### 4. Deploy Edge Function

```bash
supabase functions deploy push-notification
```

### 5. Run Database Migration

Apply the push subscriptions migration:
```bash
supabase db push
```

Or run the SQL directly in Supabase SQL Editor from:
`supabase/migrations/003_push_subscriptions.sql`

## Usage in Code

### Subscribe to Push Notifications
```typescript
import { subscribeToPush } from "@/lib/push-notification-service";

// When user enables notifications
await subscribeToPush();
```

### Check Subscription Status
```typescript
import { isPushSubscribed } from "@/lib/push-notification-service";

const isSubscribed = await isPushSubscribed();
```

### Unsubscribe
```typescript
import { unsubscribeFromPush } from "@/lib/push-notification-service";

await unsubscribeFromPush();
```

### Send Notification (Server-side)
```typescript
// From Edge Function or server
const response = await fetch('YOUR_SUPABASE_URL/functions/v1/push-notification', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'send_to_user',
    userId: 'user-uuid',
    notification: {
      title: 'Hello!',
      body: 'This is a test notification',
      url: '/notifications',
    }
  })
});
```

## Troubleshooting

### Notifications not showing
1. Check browser notification permissions (Settings > Privacy > Notifications)
2. Ensure service worker is registered (`/sw.js`)
3. Check browser console for errors

### Push subscription fails
1. Verify VAPID public key is set correctly
2. Check service worker is active
3. Ensure HTTPS is enabled (required for Push API)

### Notifications not received on mobile
1. Ensure app is installed as PWA
2. Check device notification settings
3. Verify push subscription is saved to database

## Security Considerations
- VAPID private key should NEVER be exposed to client
- Store private key only in Supabase Edge Function secrets
- Use RLS policies to protect push_subscriptions table
- Validate user ownership before sending notifications
