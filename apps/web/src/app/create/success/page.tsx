import React from 'react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-4">Request Received!</h1>
        <p className="text-gray-600 mb-6">
          Your invitation is now waiting for review and activation. An admin will contact you using the phone number you provided.
        </p>
        <p className="text-sm text-gray-400">
          You can close this page.
        </p>
      </div>
    </div>
  );
}
