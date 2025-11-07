"use client";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <a
          href="/dashboard"
          className="bg-green-700 hover:bg-green-600 text-white rounded-md px-6 py-3 inline-block"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
