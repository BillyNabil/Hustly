import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="glass-card p-8 max-w-md w-full text-center space-y-6">
                <div className="text-8xl font-bold text-primary">404</div>
                <h2 className="text-2xl font-bold text-foreground">
                    Page Not Found
                </h2>
                <p className="text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="btn-primary inline-block px-6 py-3 rounded-xl font-semibold"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
