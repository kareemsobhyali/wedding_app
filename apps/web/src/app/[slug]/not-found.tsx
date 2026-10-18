import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-stone-800 p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-serif mb-4">Invitation Unavailable</h1>
        <p className="text-stone-600 mb-8">
          The wedding invitation you are looking for does not exist or is no longer available.
        </p>
        <Link href="/" className="px-6 py-2 border border-stone-800 hover:bg-stone-800 hover:text-white transition-colors">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
