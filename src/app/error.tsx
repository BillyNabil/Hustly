'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="glass-card p-8 max-w-md w-full text-center space-y-6">
                <div className="text-6xl">⚠️</div>
                <h2 className="text-2xl font-bold text-foreground">
                    Something went wrong!
                </h2>
                <p className="text-muted-foreground">
                    {error.message || 'An unexpected error occurred'}
                </p>
                <button
                    onClick={() => reset()}
                    className="btn-primary px-6 py-3 rounded-xl font-semibold"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
