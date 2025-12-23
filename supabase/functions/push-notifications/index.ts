import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import webpush from 'https://esm.sh/web-push@3.6.7'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!
const adminEmail = 'mailto:admin@hustly.app'

webpush.setVapidDetails(adminEmail, vapidPublicKey, vapidPrivateKey)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface NotificationRequest {
    user_id: string
    title: string
    message: string
    url?: string
}

Deno.serve(async (req) => {
    try {
        const { user_id, title, message, url } = await req.json() as NotificationRequest

        if (!user_id || !title || !message) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
        }

        // Get user's subscriptions
        const { data: subscriptions, error } = await supabase
            .from('push_subscriptions')
            .select('*')
            .eq('user_id', user_id)

        if (error) throw error
        if (!subscriptions || subscriptions.length === 0) {
            return new Response(JSON.stringify({ message: 'No subscriptions found' }), { status: 200 })
        }

        // Send notifications
        const results = await Promise.all(subscriptions.map(async (sub) => {
            try {
                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: atob(sub.p256dh).split('').map(c => c.charCodeAt(0)),
                        auth: atob(sub.auth).split('').map(c => c.charCodeAt(0))
                    }
                }

                // Note: web-push library expects keys as strings or buffers usually, 
                // adapting for Deno/Browser context might need tweaking depending on specific library version behavior.
                // A robust implementation uses the raw values.

                // Correct structure for web-push:
                const subPayload = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh, // Assuming stored as base64 string which web-push usually handles
                        auth: sub.auth
                    }
                }

                await webpush.sendNotification(
                    subPayload,
                    JSON.stringify({
                        title,
                        body: message,
                        url: url || '/',
                        icon: '/icons/icon-192x192.svg'
                    })
                )
                return { success: true, id: sub.id }
            } catch (err) {
                // If 410 Gone, remove subscription
                if (err.statusCode === 410) {
                    await supabase.from('push_subscriptions').delete().eq('id', sub.id)
                }
                return { success: false, id: sub.id, error: err.message }
            }
        }))

        return new Response(JSON.stringify({ results }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
})
