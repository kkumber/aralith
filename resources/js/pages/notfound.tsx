import { Link } from '@inertiajs/react';

export default function NotFound() {
    return (
        <div className="bg-background text-foreground animate-in fade-in flex min-h-screen flex-col items-center justify-center px-6 text-center duration-700 ease-out">
            <div className="max-w-md">
                {/* SVG Illustration */}
                <div className="mb-8">
                    <svg
                        className="text-primary animate-in zoom-in-50 mx-auto h-48 w-48 duration-700 ease-in-out"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.75 9L8.25 15m7.5-6l1.5 6M3 9l1.71 6.84a2 2 0 001.95 1.5h10.68a2 2 0 001.95-1.5L21 9M3 9h18M7.5 21h9"
                        />
                    </svg>
                </div>

                {/* Text Content */}
                <h1 className="font-headers text-text-primary dark:text-dark-text-primary mb-4 text-4xl font-bold">404 — Page Not Found</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary font-paragraph mb-6">
                    The page you are looking for doesn’t exist or has been moved.
                </p>

                <Link
                    href={route('main')}
                    className="hover:bg-opacity-90 text-primary inline-flex items-center justify-center rounded-md bg-[--color-primary-green] px-6 py-3 font-medium transition duration-200"
                >
                    ← Back to Homepage
                </Link>
            </div>
        </div>
    );
}
