'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  Settings, 
  Trash2, 
  Calendar, 
  Phone, 
  ExternalLink, 
  QrCode, 
  Copy, 
  Check, 
  AlertTriangle,
  Sparkles,
  Users
} from 'lucide-react';

interface InvitationItem {
  id: string;
  groomName: string;
  brideName: string;
  customerPhone: string;
  status: string;
  expiresAt: string | null;
  weddingDate: string | null;
  createdAt: string;
  slugs: { slug: string }[];
  template?: { name: string; slug: string } | null;
}

export default function AdminInvitationsTable({ 
  initialItems, 
  apiToken 
}: { 
  initialItems: InvitationItem[]; 
  apiToken: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState<InvitationItem[]>(initialItems);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deleteModalItem, setDeleteModalItem] = useState<InvitationItem | null>(null);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const confirmDelete = async () => {
    if (!deleteModalItem) return;
    const targetId = deleteModalItem.id;
    setDeletingId(targetId);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      const res = await fetch(`${apiUrl}/admin/invitations/${targetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'فشل حذف الدعوة');
      }

      // Optimistically remove from state
      setItems(prev => prev.filter(item => item.id !== targetId));
      setDeleteModalItem(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (inv: InvitationItem) => {
    const isExpired = inv.status === 'EXPIRED' || (inv.expiresAt && new Date() > new Date(inv.expiresAt));
    if (isExpired) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-extrabold border border-red-200 flex items-center gap-1 w-fit">
          <span>⛔ منتهية</span>
        </span>
      );
    }
    switch (inv.status) {
      case 'ACTIVE':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-200 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>نشطة ومفعلة</span>
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold border border-amber-200 flex items-center gap-1 w-fit">
            <span>قيد المراجعة</span>
          </span>
        );
      case 'DRAFT':
        return (
          <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-extrabold border border-stone-200 flex items-center gap-1 w-fit">
            <span>مسودة</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px] font-extrabold w-fit">
            {inv.status}
          </span>
        );
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-[#EADBCA] shadow-sm my-6">
        <Sparkles className="w-10 h-10 text-[#C5A059] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#38260F] mb-1">لا توجد دعوات مسجلة حالياً</h3>
        <p className="text-xs text-gray-500 mb-4">قم بإنشاء دعوة جديدة لبدء إدارة الحفلات ومشاركتها مع العملاء</p>
      </div>
    );
  }

  return (
    <>
      {/* ========================================================= */}
      {/* 1. Mobile Cards View (< 768px) */}
      {/* ========================================================= */}
      <div className="md:hidden space-y-4 my-4">
        {items.map((inv) => {
          const currentSlug = inv.slugs[0]?.slug;
          const formattedDate = inv.weddingDate 
            ? new Date(inv.weddingDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
            : 'لم يحدد';

          return (
            <div 
              key={inv.id}
              className="bg-white rounded-2xl p-4 border border-[#EADBCA] shadow-sm space-y-3"
            >
              {/* Card Header: Couple & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-[#38260F] leading-tight" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                    {inv.groomName} & {inv.brideName}
                  </h3>
                  {currentSlug && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#8C6D38] font-mono font-bold">
                      <span>/{currentSlug}</span>
                      <button 
                        onClick={() => handleCopyLink(currentSlug)}
                        className="p-1 rounded hover:bg-stone-100 text-gray-400 hover:text-stone-700 transition-colors"
                        title="نسخ الرابط"
                      >
                        {copiedSlug === currentSlug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  {getStatusBadge(inv)}
                </div>
              </div>

              {/* Info Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-1 border-t border-[#F5EFE6]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8C6D38] shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]" dir="ltr">
                  <Phone className="w-3.5 h-3.5 text-[#8C6D38] shrink-0" />
                  <span className="truncate">{inv.customerPhone}</span>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-[#F5EFE6]">
                {/* 1. Manage */}
                <Link
                  href={`/admin/invitations/${inv.id}`}
                  className="py-2 px-1 rounded-xl bg-[#FAF0D7] hover:bg-[#F2E0B5] text-[#8C6D38] font-bold text-xs flex flex-col items-center justify-center gap-1 text-center transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>إدارة</span>
                </Link>

                {/* 2. Live View */}
                {currentSlug ? (
                  <a
                    href={`/${currentSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex flex-col items-center justify-center gap-1 text-center transition-colors"
                  >
                    <Eye className="w-4 h-4 text-stone-600" />
                    <span>معاينة</span>
                  </a>
                ) : (
                  <div className="opacity-40 py-2 text-center text-xs">--</div>
                )}

                {/* 3. Printable QR Card */}
                {currentSlug ? (
                  <a
                    href={`/${currentSlug}/card`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex flex-col items-center justify-center gap-1 text-center transition-colors"
                    title="كارت QR للطباعة"
                  >
                    <QrCode className="w-4 h-4 text-amber-700" />
                    <span>كارت QR</span>
                  </a>
                ) : (
                  <div className="opacity-40 py-2 text-center text-xs">--</div>
                )}

                {/* 4. Delete */}
                <button
                  onClick={() => setDeleteModalItem(inv)}
                  disabled={deletingId === inv.id}
                  className="py-2 px-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex flex-col items-center justify-center gap-1 text-center transition-colors disabled:opacity-50"
                  title="حذف الدعوة"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>حذف</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 2. Desktop Table View (>= 768px) */}
      {/* ========================================================= */}
      <div className="hidden md:block bg-white rounded-3xl border border-[#EADBCA] shadow-sm overflow-hidden my-6">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-right border-collapse">
            <thead className="bg-[#FAF7F2] border-b border-[#EADBCA] text-xs font-extrabold text-[#735227] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">العروسين والرابط</th>
                <th className="py-4 px-6">رقم هاتف العميل</th>
                <th className="py-4 px-6">حالة الدعوة</th>
                <th className="py-4 px-6">تاريخ الزفاف</th>
                <th className="py-4 px-6 text-center">الإجراءات والتحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6] text-sm">
              {items.map((inv) => {
                const currentSlug = inv.slugs[0]?.slug;
                const formattedDate = inv.weddingDate 
                  ? new Date(inv.weddingDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
                  : 'غير محدد';

                return (
                  <tr key={inv.id} className="hover:bg-[#FFFDF9] transition-colors">
                    
                    {/* Couple & Slug */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-base text-[#38260F]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                          {inv.groomName}  &  {inv.brideName}
                        </span>
                        {currentSlug && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#8C6D38] font-mono">
                            <span>/{currentSlug}</span>
                            <button
                              onClick={() => handleCopyLink(currentSlug)}
                              className="text-gray-400 hover:text-[#8C6D38] transition-colors"
                              title="نسخ الرابط"
                            >
                              {copiedSlug === currentSlug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Customer Phone */}
                    <td className="py-4 px-6 font-mono text-xs text-gray-600" dir="ltr">
                      {inv.customerPhone}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {getStatusBadge(inv)}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-gray-700 font-semibold">
                      {formattedDate}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {/* Manage */}
                        <Link
                          href={`/admin/invitations/${inv.id}`}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF0D7] hover:bg-[#F2E0B5] text-[#8C6D38] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>إدارة</span>
                        </Link>

                        {/* Live Demo */}
                        {currentSlug && (
                          <a
                            href={`/${currentSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                            title="معاينة الدعوة"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}

                        {/* Printable QR Card */}
                        {currentSlug && (
                          <a
                            href={`/${currentSlug}/card`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                            title="كارت QR عالي الجودة للطباعة"
                          >
                            <QrCode className="w-4 h-4" />
                          </a>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteModalItem(inv)}
                          disabled={deletingId === inv.id}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
                          title="حذف الدعوة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. Delete Confirmation Modal */}
      {/* ========================================================= */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-red-100 shadow-2xl text-right">
            
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-gray-900 mb-2">
              تأكيد حذف الدعوة
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              هل أنت متأكد من رغبتك في حذف دعوة <strong className="text-gray-900">({deleteModalItem.groomName} & {deleteModalItem.brideName})</strong>؟ 
              سيتم تعطيل الرابط وحذفها من القائمة النشطة.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setDeleteModalItem(null)}
                disabled={deletingId !== null}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-colors"
              >
                تراجع
              </button>

              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deletingId ? 'جاري الحذف...' : 'نعم، احذف الدعوة'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
