'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickCreateModal({ apiToken }: { apiToken: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    customerPhone: '',
    weddingDate: '',
    language: 'ar',
    validityType: 'days_30', // 'minutes_30' | 'minutes_60' | 'days_30' | 'days_60' | 'unlimited'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let expiresAt: string | null = null;
      if (formData.validityType === 'minutes_30') {
        expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      } else if (formData.validityType === 'minutes_60') {
        expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      } else if (formData.validityType === 'days_30') {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (formData.validityType === 'days_60') {
        expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
      }

      const payload = {
        groomName: formData.groomName,
        brideName: formData.brideName,
        customerPhone: formData.customerPhone,
        weddingDate: formData.weddingDate,
        language: formData.language,
        expiresAt,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      const res = await fetch(`${apiUrl}/admin/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create invitation');
      const data = await res.json();
      const id = data.data?.id || data.id;
      setIsOpen(false);
      router.push(`/admin/invitations/${id}`);
    } catch (err: any) {
      alert(err.message || 'Error creating invitation');
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 w-full sm:w-auto"
      >
        + Quick Add
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Quick Add Invitation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Groom Name</label>
                <input required className="w-full border rounded p-2" value={formData.groomName} onChange={e => setFormData({...formData, groomName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bride Name</label>
                <input required className="w-full border rounded p-2" value={formData.brideName} onChange={e => setFormData({...formData, brideName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Customer Phone</label>
                <input required className="w-full border rounded p-2" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wedding Date</label>
                <input type="date" required className="w-full border rounded p-2" value={formData.weddingDate} onChange={e => setFormData({...formData, weddingDate: e.target.value})} />
              </div>

              {/* Language Selector */}
              <div>
                <label className="block text-sm font-medium mb-1 text-indigo-900 font-bold">لغة الدعوة واتجاه العرض (Language)</label>
                <select 
                  className="w-full border rounded p-2 bg-indigo-50/50 font-medium"
                  value={formData.language} 
                  onChange={e => setFormData({...formData, language: e.target.value})}
                >
                  <option value="ar">🇸🇦 العربية (Arabic - RTL)</option>
                  <option value="en">🇬🇧 English (الإنجليزية - LTR)</option>
                </select>
              </div>

              {/* Validity Selector */}
              <div>
                <label className="block text-sm font-medium mb-1 text-indigo-900 font-bold">مدة الصلاحية (Validity Expiration)</label>
                <select 
                  className="w-full border rounded p-2 bg-indigo-50/50 font-medium"
                  value={formData.validityType} 
                  onChange={e => setFormData({...formData, validityType: e.target.value})}
                >
                  <option value="days_30">📅 دعوة رسمية (صالحة لمدة 30 يوم)</option>
                  <option value="days_60">📅 دعوة رسمية (صالحة لمدة 60 يوم)</option>
                  <option value="minutes_30">⏱️ رابط تجريبي للعميل (30 دقيقة فقط)</option>
                  <option value="minutes_60">⏱️ رابط تجريبي للعميل (60 دقيقة فقط)</option>
                  <option value="unlimited">♾️ مفتوح دائماً بدون انتهاء</option>
                </select>
                <p className="text-[11px] text-gray-500 mt-1">يمكنك تعديل مدة الصلاحية لاحقاً بالدقائق أو الأيام في أي وقت.</p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold">
                  {loading ? 'Creating...' : 'Create & Edit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
