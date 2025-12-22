'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0b',
                    padding: '1rem',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '2rem',
                        borderRadius: '1rem',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💥</div>
                        <h2 style={{
                            color: '#fff',
                            fontSize: '1.5rem',
                            marginBottom: '1rem'
                        }}>
                            Critical Error
                        </h2>
                        <p style={{
                            color: '#888',
                            marginBottom: '1.5rem'
                        }}>
                            {error.message || 'Something went terribly wrong'}
                        </p>
                        <button
                            onClick={() => reset()}
                            style={{
                                background: '#d4af37',
                                color: '#000',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
