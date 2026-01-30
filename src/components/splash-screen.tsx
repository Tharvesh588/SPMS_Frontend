"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SplashScreenProps {
    appName?: string;
    subtitle?: string;
    redirectTo?: string;
    displayDuration?: number; // in milliseconds
}

export function SplashScreen({
    appName = "ProjectVerse",
    subtitle = "Please wait while we prepare the application for you...",
    redirectTo = "/u/portal/auth",
    displayDuration = 2000 // 2 seconds
}: SplashScreenProps) {
    const router = useRouter();
    const [sessionTime, setSessionTime] = useState<string>("Loading...");

    useEffect(() => {
        const updateSessionTime = () => {
            const now = new Date();
            const formattedTime = now.toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            setSessionTime(formattedTime);
        };

        updateSessionTime();
        const interval = setInterval(updateSessionTime, 1000);

        // Redirect after specified duration
        const redirectTimer = setTimeout(() => {
            router.push(redirectTo);
        }, displayDuration);

        return () => {
            clearInterval(interval);
            clearTimeout(redirectTimer);
        };
    }, [router, redirectTo, displayDuration]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                {/* Loading Animation - Wave Dots */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-[bounce_1s_ease-in-out_infinite_0ms]"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_150ms]"></div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full animate-[bounce_1s_ease-in-out_infinite_300ms]"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_450ms]"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-[bounce_1s_ease-in-out_infinite_600ms]"></div>
                </div>

                {/* App Name */}
                <h1 className="text-3xl font-semibold text-gray-900 mb-3 font-heading">
                    Loading {appName}
                </h1>

                {/* Subtitle */}
                <p className="text-gray-600 text-center max-w-md">
                    {subtitle}
                </p>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                        {/* Developer Credit */}
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">contact@imtharvesh.me</span>
                        </div>

                        {/* Session Date & Time */}
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-mono tabular-nums">{sessionTime}</span>
                        </div>

                        {/* App Provider */}
                        <div className="flex items-center">
                            <span className="text-gray-500">🩶</span>
                            <a
                                href="https://imtharvesh.me"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                            >
                            imtharvesh.me
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
