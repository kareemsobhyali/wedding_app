'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SlugEditor({ invitationId, currentSlug, apiToken }: { invitationId: string, currentSlug: string, apiToken: string }) {
  const [slug, setSlug] = useState(currentSlug);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      const res = await fetch(`${apiUrl}/admin/invitations/${invitationId}/slug`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({ slug })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to update URL slug');
      
      alert('Custom URL updated successfully');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error updating Custom URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded border border-blue-100">
      <h2 className="font-bold text-lg border-b pb-2 mb-4 text-blue-900">Custom URL (Slug)</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center border rounded overflow-hidden">
          <span className="bg-gray-100 p-2 text-gray-500 text-sm">domain.com/</span>
          <input 
            type="text"
            className="p-2 flex-1 outline-none font-semibold text-blue-900"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            placeholder="e.g. ahmed-and-sara"
          />
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading || !slug || slug === currentSlug}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save URL'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Changing the URL will immediately redirect future visitors. The old URL will stop working.</p>
    </div>
  );
}
