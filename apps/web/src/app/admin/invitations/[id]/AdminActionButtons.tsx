'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Archive, Copy, Trash2, AlertTriangle } from 'lucide-react';

export default function AdminActionButtons({ 
  invitationId, 
  apiToken 
}: { 
  invitationId: string; 
  apiToken: string; 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        throw new Error(data.error?.message || data.message || 'فشل تنفيذ الإجراء');
      }
      
      alert(`تم تطبيق العملية بنجاح!`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'فشلت العملية');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

    try {
      const res = await fetch(`${apiUrl}/admin/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'فشل حذف الدعوة');
      }

      alert('تم حذف الدعوة بنجاح');
      router.push('/admin/invitations');
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء الحذف');
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Activate */}
        <button 
          disabled={loading}
          onClick={() => performAction('activate')}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>تفعيل الدعوة</span>
        </button>

        {/* Disable */}
        <button 
          disabled={loading}
          onClick={() => performAction('disable')}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>تعطيل مؤقت</span>
        </button>

        {/* Duplicate */}
        <button 
          disabled={loading}
          onClick={() => performAction('duplicate')}
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>تكرار الدعوة</span>
        </button>

        {/* Archive */}
        <button 
          disabled={loading}
          onClick={() => performAction('archive')}
          className="px-3.5 py-2 bg-stone-600 hover:bg-stone-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>أرشفة</span>
        </button>

        {/* Delete Button */}
        <button 
          disabled={loading}
          onClick={() => setShowDeleteModal(true)}
          className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 active:scale-95 border border-red-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 mr-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>حذف الدعوة</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-red-100 shadow-2xl text-right">
            
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-gray-900 mb-2">
              تأكيد حذف الدعوة
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              هل أنت متأكد من رغبتك في حذف هذه الدعوة؟ سيتم إلغاء تفعيل الرابط وحذفها نهائياً.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-colors"
              >
                تراجع
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{loading ? 'جاري الحذف...' : 'نعم، احذف الدعوة'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
