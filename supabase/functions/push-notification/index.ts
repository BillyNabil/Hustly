// Push Notification Edge Function for Hustly
// Handles sending push notifications to subscribed users

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    url?: string;
    tag?: string;
    data?: Record<string, any>;
}

// Send push notification to a single subscription
async function sendPushNotification(
    subscription: PushSubscription,
    payload: NotificationPayload,
    vapidPrivateKey: string,
    vapidPublicKey: string
): Promise<boolean> {
    try {
        // Web Push API implementation
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(payload));

        // Create JWT for VAPID authentication
        const vapidJwt = await createVapidJwt(subscription.endpoint, vapidPrivateKey, vapidPublicKey);

        const response = await fetch(subscription.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Encoding": "aes128gcm",
                "TTL": "86400",
                "Authorization": `vapid t=${vapidJwt}, k=${vapidPublicKey}`,
            },
            body: data,
        });

        if (!response.ok) {
            console.error(`Push failed: ${response.status} ${response.statusText}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Push notification error:", error);
        return false;
    }
}

// Create VAPID JWT token
async function createVapidJwt(
    audience: string,
    privateKey: string,
    publicKey: string
): Promise<string> {
    const url = new URL(audience);
    const aud = `${url.protocol}//${url.host}`;

    const header = { alg: "ES256", typ: "JWT" };
    const payload = {
        aud,
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 hours
        sub: "mailto:notifications@hustly.app",
    };

    const encoder = new TextEncoder();
    const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

    const data = encoder.encode(`${headerB64}.${payloadB64}`);

    // Import private key and sign
    const keyData = Uint8Array.from(atob(privateKey.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey(
        "pkcs8",
        keyData,
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        key,
        data
    );

    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    return `${headerB64}.${payloadB64}.${signatureB64}`;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
        const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";

        const { action, userId, notification, subscriptions } = await req.json();

        switch (action) {
            case "send_to_user": {
                // Get user's push subscriptions
                const { data: userSubscriptions, error } = await supabaseClient
                    .from("push_subscriptions")
                    .select("*")
                    .eq("user_id", userId);

                if (error) throw error;

                // Send to all user's devices
                const results = await Promise.all(
                    userSubscriptions.map((sub: any) =>
                        sendPushNotification(
                            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                            notification,
                            vapidPrivateKey,
                            vapidPublicKey
                        )
                    )
                );

                return new Response(
                    JSON.stringify({ success: true, sent: results.filter(Boolean).length }),
                    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            case "send_to_all": {
                // Get all push subscriptions
                const { data: allSubscriptions, error } = await supabaseClient
                    .from("push_subscriptions")
                    .select("*");

                if (error) throw error;

                // Send to all devices
                const results = await Promise.all(
                    allSubscriptions.map((sub: any) =>
                        sendPushNotification(
                            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                            notification,
                            vapidPrivateKey,
                            vapidPublicKey
                        )
                    )
                );

                return new Response(
                    JSON.stringify({ success: true, sent: results.filter(Boolean).length }),
                    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            case "subscribe": {
                // Save push subscription
                const { subscription: sub, user_id } = await req.json();

                const { error } = await supabaseClient
                    .from("push_subscriptions")
                    .upsert({
                        user_id,
                        endpoint: sub.endpoint,
                        p256dh: sub.keys.p256dh,
                        auth: sub.keys.auth,
                        created_at: new Date().toISOString(),
                    }, {
                        onConflict: "endpoint",
                    });

                if (error) throw error;

                return new Response(
                    JSON.stringify({ success: true }),
                    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            case "unsubscribe": {
                // Remove push subscription
                const { endpoint } = await req.json();

                const { error } = await supabaseClient
                    .from("push_subscriptions")
                    .delete()
                    .eq("endpoint", endpoint);

                if (error) throw error;

                return new Response(
                    JSON.stringify({ success: true }),
                    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            default:
                return new Response(
                    JSON.stringify({ error: "Invalid action" }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
        }
    } catch (error) {
        console.error("Push notification function error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
