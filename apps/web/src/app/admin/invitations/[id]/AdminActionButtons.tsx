'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function AdminActionButtons({ invitationId, apiToken }: { invitationId: string, apiToken: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const performAction = async (action: string) => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
    
    try {
      const res = await fetch(`${apiUrl}/admin/invitations/${invitationId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to perform action');
      }
      
      alert(`Invitation ${action}d successfully!`);
      router.refresh(); // Refresh the page to get the updated status
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button 
        disabled={loading}
        onClick={() => performAction('activate')}
        className="px-4 py-2 bg-green-600 text-white font-bold rounded disabled:opacity-50"
      >
        Activate
      </button>
      <button 
        disabled={loading}
        onClick={() => performAction('disable')}
        className="px-4 py-2 bg-yellow-600 text-white font-bold rounded disabled:opacity-50"
      >
        Disable
      </button>
      <button 
        disabled={loading}
        onClick={() => performAction('archive')}
        className="px-4 py-2 bg-gray-600 text-white font-bold rounded disabled:opacity-50"
      >
        Archive
      </button>
      <button 
        disabled={loading}
        onClick={() => performAction('duplicate')}
        className="px-4 py-2 bg-blue-600 text-white font-bold rounded disabled:opacity-50"
      >
        Duplicate
      </button>
    </div>
  );
}
