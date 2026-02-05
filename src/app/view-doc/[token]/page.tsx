'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { invalidateFileToken } from '@/lib/api';

const API_BASE_URL = "https://egspgoi-spms.onrender.com/api/v1";

export default function ViewDocPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;
    const [error, setError] = useState<string | null>(null);

    // Invalidate token when component unmounts or window closes
    useEffect(() => {
        const handleUnload = () => {
            // Use navigator.sendBeacon for reliable execution on unload
            navigator.sendBeacon(`${API_BASE_URL}/files/token/${token}`);
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            // Also call API on component unmount (e.g. navigation)
            invalidateFileToken(token).catch(err => console.error("Failed to invalidate token", err));
        };
    }, [token]);

    if (!token) return <div>Invalid URL</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const fileUrl = `${API_BASE_URL}/files/view/${token}`;

    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col">
            <div className="bg-white p-4 shadow flex justify-between items-center px-8">
                <h1 className="font-semibold text-lg">Secure Document Viewer</h1>
                <button
                    onClick={() => window.close()}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Close Document
                </button>
            </div>
            <div className="flex-1 p-4">
                <iframe
                    src={fileUrl}
                    className="w-full h-full border rounded shadow-lg bg-white"
                    title="Document Viewer"
                    onError={() => setError("Failed to load document. The link may have expired.")}
                />
            </div>
        </div>
    );
}
