'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Calendar, CheckCircle2, AlertTriangle, Infinity as InfinityIcon, Sparkles } from 'lucide-react';

interface Props {
  invitationId: string;
  currentExpiresAt: string | null;
  apiToken: string;
}

export default function AdminValidityManager({ invitationId, currentExpiresAt, apiToken }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('30');
  const [customDays, setCustomDays] = useState('30');
  const [customDateTime, setCustomDateTime] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  // Calculate live countdown / remaining time
  useEffect(() => {
    if (!currentExpiresAt) {
      setTimeRemaining('الدعوة مفتوحة بشكل دائم بدون تاريخ انتهاء.');
      setIsExpired(false);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(currentExpiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining('انتهت الصلاحية! الدعوة متوقفة حالياً ولا تظهر للزوار.');
      } else {
        setIsExpired(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeRemaining(`متبقي: ${days} يوم و ${hours} ساعة و ${minutes} دقيقة`);
        } else if (hours > 0) {
          setTimeRemaining(`متبقي: ${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`);
        } else {
          setTimeRemaining(`متبقي: ${minutes} دقيقة و ${seconds} ثانية`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentExpiresAt]);

  // Apply expiration helper
  const applyExpiry = async (date: Date | null, description: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      const res = await fetch(`${apiUrl}/admin/invitations/${invitationId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          expiresAt: date ? date.toISOString() : null
        })
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || 'فشل تحديث الصلاحية');
      }

      alert(`تم بنجاح: ${description}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء التحديث');
    } finally {
      setLoading(false);
    }
  };

  // 1. By Minutes (for Trial / Demo links)
  const setExpiryByMinutes = (minutes: number) => {
    const newDate = new Date(Date.now() + minutes * 60 * 1000);
    applyExpiry(newDate, `تم تعيين صلاحية تجريبية لمدة (${minutes} دقيقة)`);
  };

  // 2. By Days (for Official Client Invitations)
  const setExpiryByDays = (days: number) => {
    const newDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    applyExpiry(newDate, `تم تعيين صلاحية رسمية لمدة (${days} يوم)`);
  };

  // 3. By Exact Date & Time
  const setExpiryByDateTime = () => {
    if (!customDateTime) {
      alert('يرجى اختيار التاريخ والوقت أولاً');
      return;
    }
    const newDate = new Date(customDateTime);
    applyExpiry(newDate, `تم تعيين الانتهاء في تاريخ: ${newDate.toLocaleString('ar-EG')}`);
  };

  // 4. Remove Expiry (Unlimited)
  const removeExpiry = () => {
    if (confirm('هل أنت متأكد من إلغاء انتهاء الصلاحية وجعل الدعوة دائمة؟')) {
      applyExpiry(null, 'تم إلغاء الانتهاء وجعل الدعوة مفتوحة بشكل دائم');
    }
  };

  const formattedCurrent = currentExpiresAt 
    ? new Date(currentExpiresAt).toLocaleString('ar-EG', {
        dateStyle: 'full',
        timeStyle: 'medium'
      })
    : null;

  return (
    <div className="bg-white p-6 shadow-md rounded-2xl border border-indigo-100 space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">نظام إدارة صلاحية الدعوة</h2>
        </div>
        <span className="text-xs text-gray-500 font-medium">تجريبي بالدقائق • رسمي بالأيام</span>
      </div>

      {/* Current Status Box */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        !currentExpiresAt 
          ? 'bg-blue-50 border-blue-200 text-blue-900' 
          : isExpired 
            ? 'bg-red-50 border-red-200 text-red-900' 
            : 'bg-green-50 border-green-200 text-green-900'
      }`}>
        <div>
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            {!currentExpiresAt ? (
              <>
                <InfinityIcon className="w-4 h-4 text-blue-600" />
                <span>حالة الصلاحية: غير محددة (مفتوحة دائماً)</span>
              </>
            ) : isExpired ? (
              <>
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>حالة الصلاحية: منتهية الصلاحية ⛔ (الدعوة متوقفة حالياً)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>حالة الصلاحية: نشطة ومتاحة للزوار ✅</span>
              </>
            )}
          </div>
          {formattedCurrent && (
            <p className="text-xs text-gray-600">ينتهي في: <strong dir="ltr">{formattedCurrent}</strong></p>
          )}
          <p className="text-xs font-semibold mt-1 text-gray-700">{timeRemaining}</p>
        </div>

        {currentExpiresAt && (
          <button
            disabled={loading}
            onClick={removeExpiry}
            className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold shrink-0 transition-all shadow-xs"
          >
            إلغاء الانتهاء (دائم)
          </button>
        )}
      </div>


      {/* Section 1: Minutes (Trial / Demo Mode) */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⏱️</span>
            <div>
              <h3 className="font-bold text-sm text-amber-950">1. رابط تجريبي للعميل (بالدقائق)</h3>
              <p className="text-[11px] text-amber-800">مناسب لعمل لينك مؤقت لمعاينة العميل ينتهي تلقائياً بعد فترة قصيرة</p>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-amber-900 ml-1">خيارات سريعة:</span>
          {[
            { label: '15 دقيقة', val: 15 },
            { label: '30 دقيقة (مستحسن)', val: 30 },
            { label: '60 دقيقة (ساعة)', val: 60 },
            { label: '120 دقيقة (ساعتان)', val: 120 },
          ].map((preset) => (
            <button
              key={preset.val}
              disabled={loading}
              onClick={() => setExpiryByMinutes(preset.val)}
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Minutes Input */}
        <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60 max-w-sm">
          <input
            type="number"
            min="1"
            max="1440"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="دقائق مخصصة"
            className="w-28 p-1.5 text-xs border rounded-lg bg-white text-center font-bold"
          />
          <button
            disabled={loading || !customMinutes}
            onClick={() => setExpiryByMinutes(parseInt(customMinutes, 10))}
            className="px-4 py-1.5 rounded-lg bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition-all disabled:opacity-50"
          >
            تطبيق بالدقائق
          </button>
        </div>
      </div>


      {/* Section 2: Days & Exact Date (Official Wedding Mode) */}
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <div>
              <h3 className="font-bold text-sm text-indigo-950">2. دعوة زفاف رسمية للعميل (بالأيام والتاريخ)</h3>
              <p className="text-[11px] text-indigo-800">تظل الدعوة نشطة لضيوف العميل لمدة محددة ثم تقف تلقائياً بعد انتهاء الحفل</p>
            </div>
          </div>
        </div>

        {/* Quick Days Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-indigo-900 ml-1">خيارات سريعة:</span>
          {[
            { label: '7 أيام', val: 7 },
            { label: '15 يوم', val: 15 },
            { label: '30 يوم (شهر - مستحسن)', val: 30 },
            { label: '60 يوم (شهران)', val: 60 },
            { label: '90 يوم (3 أشهر)', val: 90 },
          ].map((preset) => (
            <button
              key={preset.val}
              disabled={loading}
              onClick={() => setExpiryByDays(preset.val)}
              className="px-3 py-1.5 rounded-lg bg-white border border-indigo-300 hover:bg-indigo-100 text-indigo-900 font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Exact Date Picker */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-indigo-200/60">
          <span className="text-xs font-bold text-indigo-900 ml-1">أو تحديد تاريخ ووقت دقيق:</span>
          <input
            type="datetime-local"
            value={customDateTime}
            onChange={(e) => setCustomDateTime(e.target.value)}
            className="p-1.5 text-xs border rounded-lg bg-white text-gray-800"
          />
          <button
            disabled={loading || !customDateTime}
            onClick={setExpiryByDateTime}
            className="px-4 py-1.5 rounded-lg bg-indigo-700 text-white font-bold text-xs hover:bg-indigo-800 transition-all disabled:opacity-50"
          >
            تحديد التاريخ
          </button>
        </div>
      </div>

    </div>
  );
}
