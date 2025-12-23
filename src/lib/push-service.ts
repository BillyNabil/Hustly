import { supabase } from './supabaseClient';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function registerPushSubscription(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported');
        return false;
    }

    if (!VAPID_PUBLIC_KEY) {
        console.warn('VAPID Public Key not found. Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env');
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const p256dh = subscription.getKey('p256dh');
        const auth = subscription.getKey('auth');

        if (!p256dh || !auth) return false;

        // Convert keys to base64
        const p256dhStr = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(p256dh))));
        const authStr = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(auth))));

        // Save to Supabase
        const { error } = await supabase
            .from('push_subscriptions')
            .upsert({
                user_id: user.id,
                endpoint: subscription.endpoint,
                p256dh: p256dhStr,
                auth: authStr,
                user_agent: navigator.userAgent
            }, { onConflict: 'endpoint' });

        if (error) {
            console.error('Failed to save push subscription to DB:', error);
            return false;
        }

        console.log('Push subscription registered successfully');
        return true;
    } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
        return false;
    }
}

export async function unsubscribePush(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) return false;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
        await subscription.unsubscribe();

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint);
        }
        return true;
    }
    return false;
}
