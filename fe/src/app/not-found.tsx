import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 px-4">
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">404 - Page Not Found</h1>
            <p className="text-zinc-600 mb-8">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link
                href="/dashboard"
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
                Go to Dashbaord
            </Link>
        </div>
    );
}