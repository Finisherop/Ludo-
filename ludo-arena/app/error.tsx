"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
