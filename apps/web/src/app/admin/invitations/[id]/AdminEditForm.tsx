'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getTemplateImplementation } from '../../../../templates/registry';
import { Music, Image as ImageIcon, Upload, Trash2, Volume2 } from 'lucide-react';

const TEMPLATES = [
  { id: 'palace-doors-reveal', slug: 'palace-doors-reveal', name: '🚪 Palace Doors Reveal (بوابة القصر الملكية التفاعلية - دق 3 مرات)' },
  { id: 'mughal-palace-portal', slug: 'mughal-palace-portal', name: '🕌 Mughal Palace Portal (بوابة القصر الملكية وشلال الزهور)' },
  { id: 'cathedral-grand-arch', slug: 'cathedral-grand-arch', name: '⛪ Cathedral Grand Arch (قوس الكاتدرائية الملكي)' },
  { id: 'sculpted-porcelain-arch', slug: 'sculpted-porcelain-arch', name: '🏛️ Sculpted Porcelain Arch (قوس البورسلين الملكي المنحوت 3D)' },
  { id: 'butterfly-elegance', slug: 'butterfly-elegance', name: '🦋 Butterfly Elegance (فراشة الأناقة الملكية)' },
  { id: 'golden-arabic', slug: 'golden-arabic', name: '⚜️ Golden Arabic (الطابع العربي الذهبي)' },
];

const getInitialMusic = (inv: any): string => {
  const audio = inv?.media?.find((m: any) => m.type === 'AUDIO' && !m.deletedAt);
  return audio?.publicUrl || audio?.storageKey || (inv?.customData as any)?.musicUrl || '';
};

const getInitialCover = (inv: any): string => {
  const cover = inv?.media?.find((m: any) => (m.role === 'COVER' || m.type === 'IMAGE') && !m.deletedAt);
  return cover?.publicUrl || cover?.storageKey || (inv?.customData as any)?.coverImageUrl || '';
};

const getInitialLanguage = (inv: any): 'ar' | 'en' => {
  if (inv?.customData?.language === 'en') return 'en';
  if (inv?.customData?.language === 'ar') return 'ar';
  return /[\u0600-\u06FF]/.test(inv?.groomName || inv?.brideName || '') ? 'ar' : 'en';
};

const safeToDateString = (dateVal: any): string => {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

const safeToDateTimeString = (dateVal: any): string => {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 16);
  } catch {
    return '';
  }
};

export default function AdminEditForm({ invitation, apiToken }: { invitation: any, apiToken: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    version: invitation.version,
    templateId: invitation.templateId || '',
    groomName: invitation.groomName || '',
    brideName: invitation.brideName || '',
    weddingDate: safeToDateString(invitation.weddingDate),
    venueName: invitation.venueName || '',
    venueAddress: invitation.venueAddress || '',
    googleMapsUrl: invitation.googleMapsUrl || '',
    caption: invitation.caption || '',
    weddingMessage: invitation.weddingMessage || '',
    groomPhone: invitation.groomPhone || '',
    bridePhone: invitation.bridePhone || '',
    expiresAt: safeToDateTimeString(invitation.expiresAt),
    customData: invitation.customData || {},
    language: getInitialLanguage(invitation),
    musicUrl: getInitialMusic(invitation),
    coverImageUrl: getInitialCover(invitation),
  });

  React.useEffect(() => {
    setFormData({
      version: invitation.version,
      templateId: invitation.templateId || '',
      groomName: invitation.groomName || '',
      brideName: invitation.brideName || '',
      weddingDate: safeToDateString(invitation.weddingDate),
      venueName: invitation.venueName || '',
      venueAddress: invitation.venueAddress || '',
      googleMapsUrl: invitation.googleMapsUrl || '',
      caption: invitation.caption || '',
      weddingMessage: invitation.weddingMessage || '',
      groomPhone: invitation.groomPhone || '',
      bridePhone: invitation.bridePhone || '',
      expiresAt: safeToDateTimeString(invitation.expiresAt),
      customData: invitation.customData || {},
      language: getInitialLanguage(invitation),
      musicUrl: getInitialMusic(invitation),
      coverImageUrl: getInitialCover(invitation),
    });
  }, [invitation]);

  const handleCustomDataChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customData: { ...(prev.customData || {}), [key]: value }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isAudio = type === 'audio';
    if (isAudio) setUploadingAudio(true);
    else setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      const res = await fetch(`${apiUrl}/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        },
        body: uploadData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'فشل رفع الملف');

      if (isAudio) {
        setFormData(prev => ({
          ...prev,
          musicUrl: data.url,
          customData: { ...(prev.customData || {}), musicUrl: data.url }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          coverImageUrl: data.url,
          customData: { ...(prev.customData || {}), coverImageUrl: data.url }
        }));
      }
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء رفع الملف');
    } finally {
      if (isAudio) setUploadingAudio(false);
      else setUploadingImage(false);
      // reset file input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      const res = await fetch(`${apiUrl}/admin/invitations/${invitation.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          version: formData.version,
          templateId: formData.templateId,
          language: formData.language,
          customData: {
            ...(formData.customData || {}),
            language: formData.language,
            musicUrl: formData.musicUrl,
            coverImageUrl: formData.coverImageUrl,
          },
          musicUrl: formData.musicUrl,
          coverImageUrl: formData.coverImageUrl,
          groomName: formData.groomName,
          brideName: formData.brideName,
          weddingDate: formData.weddingDate ? new Date(formData.weddingDate) : undefined,
          venueName: formData.venueName,
          venueAddress: formData.venueAddress,
          googleMapsUrl: formData.googleMapsUrl,
          caption: formData.caption,
          weddingMessage: formData.weddingMessage,
          groomPhone: formData.groomPhone,
          bridePhone: formData.bridePhone,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to update');
      }

      alert('Invitation updated successfully');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const matched = TEMPLATES.find(t => t.id === formData.templateId || t.slug === formData.templateId);
  const activeSlug = matched?.slug || (formData.templateId?.includes('-') && formData.templateId.length < 30 ? formData.templateId : invitation?.template?.slug) || 'butterfly-elegance';
  const activeTemplate = getTemplateImplementation(activeSlug);
  const customFields = activeTemplate?.metadata?.customFields || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Theme / Template Selector */}
      <div>
        <label className="block text-sm font-medium mb-1 text-indigo-900 font-bold">Theme / Template</label>
        <select 
          name="templateId" 
          value={formData.templateId} 
          onChange={e => setFormData({ ...formData, templateId: e.target.value })}
          className="w-full p-2.5 border rounded-lg bg-gray-50 font-semibold text-gray-800"
        >
          {TEMPLATES.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {activeTemplate && (
          <p className="text-xs text-indigo-600 mt-1.5 font-medium">
            {activeTemplate.metadata.description}
          </p>
        )}
      </div>

      {/* 1.1 Language & Text Direction Selector */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/70 rounded-xl border border-blue-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
            <span>🌐 لغة الدعوة واتجاه العرض (Language & Text Direction)</span>
          </label>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {formData.language === 'en' ? 'Left-to-Right (LTR) • إنجليزي' : 'من اليمين لليسار (RTL) • عربي'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFormData({ 
              ...formData, 
              language: 'ar', 
              customData: { ...(formData.customData || {}), language: 'ar' } 
            })}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
              formData.language === 'ar'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>🇸🇦 العربية (Arabic - RTL)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData({ 
              ...formData, 
              language: 'en', 
              customData: { ...(formData.customData || {}), language: 'en' } 
            })}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
              formData.language === 'en'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>🇬🇧 English (الإنجليزية - LTR)</span>
          </button>
        </div>
        
        <p className="text-[11px] text-blue-900/75">
          {formData.language === 'en' 
            ? 'عند اختيار الإنجليزية: يتحول اتجاه الثيم إلى (LTR) وتتغير نصوص الأزرار، التواريخ، والعد التنازلي ونموذج الحضور إلى الإنجليزية تلقائياً.'
            : 'عند اختيار العربية: يتم تفعيل اتجاه اليمين لليسار (RTL) مع كتابة كافة الأزرار والتواريخ باللغة العربية الفاخرة.'
          }
        </p>
      </div>

      {/* 2. Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Groom Name</label>
          <input name="groomName" value={formData.groomName} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Bride Name</label>
          <input name="brideName" value={formData.brideName} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      </div>

      {/* 3. Wedding Date & Venue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Wedding Date</label>
          <input type="date" name="weddingDate" value={formData.weddingDate} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Venue Name</label>
          <input name="venueName" value={formData.venueName} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      </div>

      {/* 4. Media & Sound Section (Audio / Music & Cover Image) */}
      <div className="p-4 bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-2xl border border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-amber-200/70 pb-2">
          <h3 className="font-bold text-base text-amber-950 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-700" />
            <span>الوسائط والموسيقى وصورة الدعوة (Media & Audio)</span>
          </h3>
          <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
            صوت وصورة
          </span>
        </div>

        {/* 4.1 Song / Music */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-amber-600" />
            <span>رابط أو ملف الأغنية / الموسيقى (Wedding Song / Music)</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              name="musicUrl" 
              value={formData.musicUrl} 
              onChange={e => setFormData({ ...formData, musicUrl: e.target.value })} 
              placeholder="ضع رابط ملف صوتي (https://... أو /assets/...) أو اضغط رفع" 
              className="flex-1 p-2.5 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" 
            />
            <label className="cursor-pointer px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-xs active:scale-95">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingAudio ? 'جارٍ الرفع...' : 'رفع ملف صوتي'}</span>
              <input 
                ref={audioInputRef}
                type="file" 
                accept="audio/*" 
                className="hidden" 
                disabled={uploadingAudio}
                onChange={e => handleFileUpload(e, 'audio')} 
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            يمكنك لصق رابط مباشر لملف MP3 أو رفع ملف صوتي من جهازك وسيتم تشغيله تلقائياً في خلفية الدعوة.
          </p>

          {/* Audio Player Preview */}
          {formData.musicUrl && (
            <div className="mt-2 p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <span>🎵 معاينة الصوت الحالي</span>
                </span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, musicUrl: '' })}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>إزالة الأغنية</span>
                </button>
              </div>
              <audio controls src={formData.musicUrl} className="w-full h-9" preload="metadata" />
            </div>
          )}
        </div>

        {/* 4.2 Cover Image / Photo */}
        <div className="space-y-1.5 pt-2 border-t border-amber-100">
          <label className="block text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>صورة الغلاف / صورة الدعوة (Cover Image / Photo)</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              name="coverImageUrl" 
              value={formData.coverImageUrl} 
              onChange={e => setFormData({ ...formData, coverImageUrl: e.target.value })} 
              placeholder="ضع رابط صورة (https://... أو /assets/...) أو اضغط رفع" 
              className="flex-1 p-2.5 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" 
            />
            <label className="cursor-pointer px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-xs active:scale-95">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingImage ? 'جارٍ الرفع...' : 'رفع صورة'}</span>
              <input 
                ref={imageInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                disabled={uploadingImage}
                onChange={e => handleFileUpload(e, 'image')} 
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            يمكنك لصق رابط صورة العروسين أو الغلاف، أو رفع صورة مباشرة من جهازك بجودة عالية.
          </p>

          {/* Image Thumbnail Preview */}
          {formData.coverImageUrl && (
            <div className="mt-2 flex items-center gap-3 p-2.5 bg-white rounded-xl border border-amber-200 shadow-2xs">
              <img 
                src={formData.coverImageUrl} 
                alt="Cover Preview" 
                className="w-16 h-16 object-cover rounded-lg border border-amber-200 shrink-0 shadow-2xs" 
                onError={(e) => { (e.target as any).style.display = 'none'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 font-mono truncate">{formData.coverImageUrl}</p>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, coverImageUrl: '' })}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 mt-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>إزالة الصورة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Expiration */}
      <div>
        <label className="block text-sm font-medium">تاريخ ووقت انتهاء الصلاحية (Expires At)</label>
        <input 
          type="datetime-local" 
          name="expiresAt" 
          value={formData.expiresAt} 
          onChange={handleChange} 
          className="w-full p-2 border rounded bg-indigo-50/30" 
        />
        <p className="text-xs text-gray-500 mt-1">اتركه فارغاً إذا كنت تريد أن تظل الدعوة دائمة بدون تاريخ انتهاء.</p>
      </div>

      {/* 6. Maps URL */}
      <div>
        <label className="block text-sm font-medium">Maps URL</label>
        <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      {/* 7. Caption */}
      <div>
        <label className="block text-sm font-medium">Custom Title (e.g. دعوة زفاف)</label>
        <input name="caption" value={formData.caption} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      {/* 8. Message */}
      <div>
        <label className="block text-sm font-medium">Custom Quote / Message</label>
        <textarea name="weddingMessage" value={formData.weddingMessage} onChange={handleChange} rows={3} className="w-full p-2 border rounded" />
      </div>

      {/* 9. Template Custom Fields */}
      {customFields.length > 0 ? (
        <div className="pt-6 border-t mt-6 col-span-1 md:col-span-2 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-indigo-900">
                ✨ بيانات وتفاصيل الثيم ({activeTemplate?.metadata?.name || activeSlug})
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                تتغير هذه الحقول تلقائياً حسب الثيم المختار لإتاحة كافة النصوص والأقسام الخاصة به
              </p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-1 rounded-full border border-indigo-200">
              {customFields.length} حقول مخصصة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customFields.map((field: any) => (
              <div key={field.key} className={field.type === 'textarea' ? 'col-span-1 md:col-span-2' : ''}>
                <label className="block text-sm font-medium mb-1 text-gray-800">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    value={(formData as any).customData?.[field.key] ?? field.defaultValue ?? ''}
                    placeholder={field.defaultValue || ''}
                    onChange={e => handleCustomDataChange(field.key, e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 text-sm"
                    rows={3}
                  />
                ) : field.type === 'color' ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={(formData as any).customData?.[field.key] ?? field.defaultValue ?? '#000000'}
                      onChange={e => handleCustomDataChange(field.key, e.target.value)}
                      className="w-10 h-10 border rounded cursor-pointer p-1"
                    />
                    <span className="text-sm text-gray-600 font-mono">{(formData as any).customData?.[field.key] ?? field.defaultValue ?? '#000000'}</span>
                  </div>
                ) : (
                  <input 
                    type={field.type === 'date' ? 'date' : 'text'}
                    value={(formData as any).customData?.[field.key] ?? field.defaultValue ?? ''}
                    placeholder={field.defaultValue || ''}
                    onChange={e => handleCustomDataChange(field.key, e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold disabled:opacity-50 transition-colors shadow-sm">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
