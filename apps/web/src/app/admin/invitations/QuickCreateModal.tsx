'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Sparkles, Calendar, Phone, User, Globe, Clock, Check } from 'lucide-react';

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
      if (!res.ok) throw new Error('فشل إنشاء الدعوة');
      const data = await res.json();
      const id = data.data?.id || data.id;
      setIsOpen(false);
      router.push(`/admin/invitations/${id}`);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء إنشاء الدعوة');
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8C6D38] to-[#5C4520] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#8C6D38]/25 flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
      >
        <Plus className="w-4 h-4" />
        <span>+ إضافة دعوة جديدة</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl p-5 sm:p-7 w-full max-w-lg border border-[#EADBCA] max-h-[90vh] overflow-y-auto text-right">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F2ECE1]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0D7] text-[#8C6D38] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#38260F]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                    إنشاء دعوة زفاف جديدة
                  </h2>
                  <p className="text-[11px] text-gray-500">أدخل البيانات الأساسية وسيتولى النظام تجهيز الرابط فوراً</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Couple Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#8C6D38]" />
                    <span>اسم العريس *</span>
                  </label>
                  <input 
                    required 
                    className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:border-[#8C6D38] focus:bg-white rounded-xl p-2.5 text-sm outline-none transition-all" 
                    placeholder="مثال: كريم"
                    value={formData.groomName} 
                    onChange={e => setFormData({...formData, groomName: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#8C6D38]" />
                    <span>اسم العروس *</span>
                  </label>
                  <input 
                    required 
                    className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:border-[#8C6D38] focus:bg-white rounded-xl p-2.5 text-sm outline-none transition-all" 
                    placeholder="مثال: ليلي"
                    value={formData.brideName} 
                    onChange={e => setFormData({...formData, brideName: e.target.value})} 
                  />
                </div>
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#8C6D38]" />
                  <span>رقم هاتف العميل (واتساب) *</span>
                </label>
                <input 
                  required 
                  dir="ltr"
                  className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:border-[#8C6D38] focus:bg-white rounded-xl p-2.5 text-sm outline-none transition-all text-left font-mono" 
                  placeholder="+201000000000"
                  value={formData.customerPhone} 
                  onChange={e => setFormData({...formData, customerPhone: e.target.value})} 
                />
              </div>

              {/* Wedding Date */}
              <div>
                <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8C6D38]" />
                  <span>تاريخ حفل الزفاف *</span>
                </label>
                <input 
                  type="date" 
                  required 
                  className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:border-[#8C6D38] focus:bg-white rounded-xl p-2.5 text-sm outline-none transition-all font-mono" 
                  value={formData.weddingDate} 
                  onChange={e => setFormData({...formData, weddingDate: e.target.value})} 
                />
              </div>

              {/* Language & Direction */}
              <div>
                <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#8C6D38]" />
                  <span>لغة الدعوة واتجاه العرض</span>
                </label>
                <select 
                  className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:border-[#8C6D38] focus:bg-white rounded-xl p-2.5 text-sm font-semibold outline-none transition-all"
                  value={formData.language} 
                  onChange={e => setFormData({...formData, language: e.target.value})}
                >
                  <option value="ar">العربية (من اليمين لليسار RTL)</option>
                  <option value="en">الإنجليزية (English LTR)</option>
                </select>
              </div>

              {/* Validity Period */}
              <div>
                <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#8C6D38]" />
                  <span>مدة صلاحية الرابط</span>
                </label>
                <select 
                  className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:border-[#8C6D38] focus:bg-white rounded-xl p-2.5 text-sm font-semibold outline-none transition-all"
                  value={formData.validityType} 
                  onChange={e => setFormData({...formData, validityType: e.target.value})}
                >
                  <option value="days_30">شهر واحد (30 يوماً - الموصى به)</option>
                  <option value="days_60">شهران (60 يوماً)</option>
                  <option value="unlimited">مفتوح بدون انتهاء صلاحية</option>
                  <option value="minutes_30">تجربة سريعة (30 دقيقة)</option>
                  <option value="minutes_60">تجربة سريعة (ساعة واحدة)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F2ECE1]">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8C6D38] to-[#5C4520] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'جاري الإنشاء...' : 'حفظ ومتابعة التعديل ✨'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
