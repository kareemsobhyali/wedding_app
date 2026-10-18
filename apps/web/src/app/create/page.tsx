'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InvitationPreview } from '../../components/invitation-preview/InvitationPreview';
import { getTemplateImplementation } from '../../templates/registry';

function CreateInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTemplate = searchParams.get('template');
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [token, setToken] = useState('');

  // Mobile tab state
  const [activeTab, setActiveTab] = useState<'FORM' | 'PREVIEW'>('FORM');

  const availableTemplates = [
    { id: 'butterfly-elegance', name: 'Butterfly Elegance 🦋', desc: 'مظروف ينفتح وفراشة ملكية طائرة (فراشة الأناقة)' },
    { id: 'heavenly-roses', name: 'Heavenly Roses 🌹', desc: 'ورود زهرية ناعمة مع تفاصيل زجاجية فاخرة (ورود الجنة)' },
    { id: 'golden-arabic', name: 'Golden Arabic ⚜️', desc: 'طابع عربي أصيل ببريق الذهب وقصتنا (الأناقة العربية الذهبية)' },
    { id: 'classic-elegance', name: 'Classic Elegance ✨', desc: 'أناقة ملكية كلاسيكية بالأسود والذهب (الفخامة الكلاسيكية)' },
    { id: 'modern-minimalist', name: 'Modern Minimalist 🖤', desc: 'مودرن هادئ بخطوط عصرية ومساحات واسعة (المودرن البسيط)' },
    { id: 'floral-romance', name: 'Floral Romance 🌸', desc: 'بتلات متساقطة وقصة التعارف والخطوبة (الرومانسية الزهرية)' },
    { id: 'botanical-rustic', name: 'Botanical Rustic 🌿', desc: 'ورق طبيعي وأغصان زيتون وختم الشمع (الريفي الطبيعي)' }
  ];

  const handleMediaLink = async (e: any, url: string, type: 'IMAGE' | 'AUDIO', role: 'COVER' | 'ORIGINAL') => {
    e.preventDefault();
    if (!url) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      await fetch(`${apiUrl}/public/media/link`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ url, type, role })
      });
      const draftRes = await fetch(`${apiUrl}/public/invitations/draft`, { 
        credentials: 'include',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
      });
      const responseData = await draftRes.json();
      setDraft(responseData.data || responseData);
    } catch (err) {
      alert('Failed to link media');
    }
  };

  const startDraft = async (templateId: string) => {
    setLoading(true);
    setErrorMsg('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    try {
      const res = await fetch(`${apiUrl}/public/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ templateId })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to start invitation draft. Please try again.');
      }
      
      const data = await res.json();
      const draftToken = data.draftSessionToken || data.data?.draftSessionToken || '';
      setToken(draftToken);
      
      const draftRes = await fetch(`${apiUrl}/public/invitations/draft`, { 
        credentials: 'include',
        headers: draftToken ? { 'Authorization': `Bearer ${draftToken}` } : undefined
      });
      const responseData = await draftRes.json();
      setDraft(responseData.data || responseData);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTemplate) {
      startDraft(initialTemplate);
    } else {
      setLoading(false);
    }
  }, [initialTemplate]);

  const handleCustomDataChange = (key: string, value: any) => {
    setDraft((prev: any) => ({
      ...prev,
      customData: { ...(prev.customData || {}), [key]: value }
    }));
    setSaveState('saving');
  };

  const handleFieldChange = (field: string, value: any) => {
    setDraft((prev: any) => ({ ...prev, [field]: value }));
    setSaveState('saving');
  };

  const handleTemplateChange = (newTemplateSlug: string) => {
    setDraft((prev: any) => ({
      ...prev,
      template: { ...(prev?.template || {}), slug: newTemplateSlug },
      templateId: newTemplateSlug
    }));
    setSaveState('saving');
  };

  useEffect(() => {
    if (!draft || saveState !== 'saving') return;

    const handler = setTimeout(async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      try {
        const res = await fetch(`${apiUrl}/public/invitations/draft`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          credentials: 'include',
          body: JSON.stringify({
            version: draft.version,
            templateId: draft.template?.slug || draft.templateId,
            groomName: draft.groomName,
            brideName: draft.brideName,
            weddingDate: draft.weddingDate,
            venueName: draft.venueName,
            customerPhone: draft.customerPhone,
            countdownEnabled: draft.countdownEnabled,
            mapsUrl: draft.googleMapsUrl,
            groomContact: draft.groomPhone,
            brideContact: draft.bridePhone,
            caption: draft.caption,
            weddingMessage: draft.weddingMessage,
            customData: draft.customData,
          })
        });

        if (res.status === 409) {
          setSaveState('error');
          alert('Conflict detected. Please refresh to sync latest changes.');
          return;
        }
        
        if (!res.ok) throw new Error('Failed to save');
        const saveRes = await res.json();
        const newVersion = saveRes.data?.version || saveRes.version;
        setDraft((prev: any) => ({ ...prev, version: newVersion }));
        setSaveState('saved');
      } catch (err) {
        setSaveState('error');
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [draft, saveState, token]);

  const handleSubmit = async () => {
    if (saveState === 'saving') {
      alert('Please wait for changes to finish saving before submitting.');
      return;
    }

    setSubmitError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/public/invitations/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || err.message || 'Validation failed');
      }
      router.push('/create/success');
    } catch (err: any) {
      setSubmitError(err.message || JSON.stringify(err));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-semibold">جارٍ التحميل...</div>;

  if (!draft) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10" dir="rtl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">اختر ثيم الدعوة</h1>
          <p className="text-gray-500 text-sm">اختر التصميم الذي يناسب ذوقك لبدء تخصيص بيانات الدعوة</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableTemplates.map(t => (
            <button 
              key={t.id}
              onClick={() => startDraft(t.id)}
              className="p-5 border-2 border-gray-200 rounded-2xl hover:border-indigo-600 hover:shadow-lg transition-all text-right bg-white group flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                  {t.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-indigo-600 font-bold">
                <span>تحديد وتخصيص</span>
                <span className="text-base group-hover:-translate-x-1 transition-transform">←</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentTemplateSlug = draft.template?.slug || draft.data?.template?.slug || draft.templateId || 'butterfly-elegance';
  const registered = getTemplateImplementation(currentTemplateSlug);
  const customFields = registered?.metadata?.customFields || [];

  const FormContent = (
    <div className="space-y-6" dir="rtl">
      
      {/* Template Switcher Dropdown */}
      <div className="bg-indigo-50/80 border border-indigo-200 p-4 rounded-2xl shadow-sm">
        <label className="block text-xs font-bold text-indigo-900 mb-1.5">
          الثيم المختار / Template
        </label>
        <select
          value={currentTemplateSlug}
          onChange={e => handleTemplateChange(e.target.value)}
          className="w-full p-2.5 bg-white border border-indigo-300 rounded-xl font-bold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
        >
          {availableTemplates.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-indigo-600 mt-2 font-medium">
          {registered?.metadata?.description || ''}
        </p>
      </div>

      {/* Main Core Fields */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">البيانات الأساسية</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">اسم العريس *</label>
            <input 
              type="text" 
              value={draft.groomName || ''}
              onChange={e => handleFieldChange('groomName', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="محمد"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">اسم العروس *</label>
            <input 
              type="text" 
              value={draft.brideName || ''}
              onChange={e => handleFieldChange('brideName', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="سارة"
              maxLength={100}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">تاريخ الزفاف *</label>
          <input 
            type="date" 
            value={draft.weddingDate ? new Date(draft.weddingDate).toISOString().split('T')[0] : ''}
            onChange={e => handleFieldChange('weddingDate', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">مكان الحفل / القاعة *</label>
          <input 
            type="text" 
            value={draft.venueName || ''}
            onChange={e => handleFieldChange('venueName', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            placeholder="فندق الفورسيزونز - قاعة اللؤلؤة"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">العنوان بالتفصيل</label>
          <input 
            type="text" 
            value={draft.venueAddress || ''}
            onChange={e => handleFieldChange('venueAddress', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            placeholder="كورنيش النيل، القاهرة"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">رابط موقع القاعة (خرائط جوجل)</label>
          <input 
            type="url" 
            value={draft.googleMapsUrl || ''}
            onChange={e => handleFieldChange('googleMapsUrl', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">عنوان الدعوة الرئيسي (Caption)</label>
          <input 
            type="text" 
            value={draft.caption || ''}
            onChange={e => handleFieldChange('caption', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            placeholder="دعوة زفاف خاصة"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">الآية الكريمة أو عبارة التهنئة</label>
          <textarea 
            rows={2}
            value={draft.weddingMessage || ''}
            onChange={e => handleFieldChange('weddingMessage', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            placeholder="«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">رقم واتساب العريس</label>
            <input 
              type="tel" 
              value={draft.groomPhone || ''}
              onChange={e => handleFieldChange('groomPhone', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="+2010..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">رقم واتساب العروس</label>
            <input 
              type="tel" 
              value={draft.bridePhone || ''}
              onChange={e => handleFieldChange('bridePhone', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="+2010..."
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={!!draft.countdownEnabled}
              onChange={e => handleFieldChange('countdownEnabled', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-sm font-semibold text-gray-700">تفعيل مؤقت العد التنازلي لموعد الفرح</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">رقم هاتفك للتواصل وتأكيد الحجز *</label>
          <input 
            type="tel" 
            value={draft.customerPhone || ''}
            onChange={e => handleFieldChange('customerPhone', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            placeholder="+201..."
          />
        </div>
      </div>

      {/* DYNAMIC THEME-SPECIFIC FIELDS */}
      {customFields.length > 0 && (
        <div className="pt-6 border-t mt-6 bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-5 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xl">✨</span>
            <h3 className="font-bold text-base text-amber-950">
              بيانات وتفاصيل الثيم ({registered?.metadata?.name || currentTemplateSlug})
            </h3>
          </div>
          <p className="text-xs text-amber-800/80 mb-5 leading-relaxed">
            هذه الخانات مخصصة لهذا الثيم بالذات، وتظهر في الأقسام الخاصة به مثل البرنامج والقصة والعبارات.
          </p>

          <div className="space-y-4">
            {customFields.map((field: any) => (
              <div key={field.key} className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-sm">
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={draft.customData?.[field.key] ?? field.defaultValue ?? ''}
                    placeholder={field.defaultValue || ''}
                    onChange={e => handleCustomDataChange(field.key, e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                ) : field.type === 'color' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={draft.customData?.[field.key] ?? field.defaultValue ?? '#000000'}
                      onChange={e => handleCustomDataChange(field.key, e.target.value)}
                      className="w-10 h-10 border rounded-lg cursor-pointer p-1"
                    />
                    <span className="text-xs font-mono text-gray-600">
                      {draft.customData?.[field.key] ?? field.defaultValue ?? '#000000'}
                    </span>
                  </div>
                ) : (
                  <input
                    type={field.type === 'date' ? 'date' : 'text'}
                    value={draft.customData?.[field.key] ?? field.defaultValue ?? ''}
                    placeholder={field.defaultValue || ''}
                    onChange={e => handleCustomDataChange(field.key, e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Section */}
      <div className="space-y-4 pt-6 border-t pb-4">
        <h3 className="font-bold text-base text-gray-900">الوسائط والموسيقى</h3>
        
        <div>
          <label className="block text-xs font-bold mb-1 text-gray-700">رابط صورة الغلاف (Direct Link)</label>
          <div className="flex gap-2">
            <input 
              type="url" 
              id="coverImgUrl"
              placeholder="https://example.com/image.jpg"
              className="flex-1 p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button 
              onClick={(e) => handleMediaLink(e, (document.getElementById('coverImgUrl') as HTMLInputElement).value, 'IMAGE', 'COVER')} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-xs font-bold transition-colors"
            >
              تطبيق
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">رابط مباشر لصورة الكابلز أو الغلاف</p>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1 text-gray-700">رابط الموسيقى (Direct MP3 Link)</label>
          <div className="flex gap-2">
            <input 
              type="url" 
              id="audioUrl"
              placeholder="https://example.com/music.mp3"
              className="flex-1 p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button 
              onClick={(e) => handleMediaLink(e, (document.getElementById('audioUrl') as HTMLInputElement).value, 'AUDIO', 'ORIGINAL')} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-xs font-bold transition-colors"
            >
              تطبيق
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">رابط ملف صوتي MP3 يعمل تلقائياً عند فتح الدعوة</p>
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
          {submitError}
        </div>
      )}

      <button 
        onClick={handleSubmit}
        className="w-full py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md text-sm cursor-pointer"
      >
        مراجعة وإرسال الدعوة للحفظ النهائي ✨
      </button>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      
      {/* Mobile Tabs */}
      <div className="lg:hidden flex bg-white border-b shrink-0" dir="rtl">
        <button 
          className={`flex-1 py-3 text-center font-bold ${activeTab === 'FORM' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('FORM')}
        >
          بيانات الدعوة 📝
        </button>
        <button 
          className={`flex-1 py-3 text-center font-bold ${activeTab === 'PREVIEW' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('PREVIEW')}
        >
          معاينة مباشرة 👁️
        </button>
      </div>

      {/* Left Panel: Form */}
      <div className={`lg:w-[480px] shrink-0 bg-white border-r h-full overflow-y-auto p-6 md:p-8 ${activeTab === 'FORM' ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between mb-6" dir="rtl">
          <div>
            <h1 className="text-2xl font-black text-gray-900">تعديل بيانات الدعوة</h1>
            <p className="text-xs text-gray-500 mt-0.5">خصص تفاصيل حفل زفافك وشاهد المعاينة الحية فوراً</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${saveState === 'saved' ? 'bg-green-100 text-green-700' : saveState === 'saving' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
            {saveState === 'saving' ? 'جارٍ الحفظ...' : saveState === 'saved' ? 'تم الحفظ ✓' : saveState === 'error' ? 'خطأ في الحفظ' : ''}
          </span>
        </div>
        {FormContent}
      </div>

      {/* Right Panel: Preview */}
      <div className={`flex-1 h-full bg-gray-100 ${activeTab === 'PREVIEW' ? 'block' : 'hidden lg:block'}`}>
        <InvitationPreview 
          data={draft?.data || draft} 
          templateId={currentTemplateSlug} 
          saveState={saveState} 
        />
      </div>

    </div>
  );
}

export default function CreateInvitationPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold text-gray-500">جارٍ التحميل...</div>}>
      <CreateInvitationContent />
    </Suspense>
  );
}
