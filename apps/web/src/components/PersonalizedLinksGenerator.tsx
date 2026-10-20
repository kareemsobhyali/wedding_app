'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  Users, 
  Send, 
  QrCode,
  FileText
} from 'lucide-react';

interface PersonalizedLinksGeneratorProps {
  slug: string;
  groomName: string;
  brideName: string;
  isArabic?: boolean;
}

export default function PersonalizedLinksGenerator({
  slug,
  groomName,
  brideName,
  isArabic = true
}: PersonalizedLinksGeneratorProps) {
  const [origin, setOrigin] = useState('');
  const [guestName, setGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [bulkInput, setBulkInput] = useState('');
  const [bulkCopied, setBulkCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const baseInviteUrl = origin ? `${origin}/${slug}` : `/${slug}`;

  // Single guest link
  const singleUrl = guestName.trim()
    ? `${baseInviteUrl}?to=${encodeURIComponent(guestName.trim())}`
    : baseInviteUrl;

  const singleCardUrl = guestName.trim()
    ? `${origin || ''}/${slug}/card?to=${encodeURIComponent(guestName.trim())}`
    : `${origin || ''}/${slug}/card`;

  const getWhatsAppMessage = (name: string, url: string) => {
    if (isArabic) {
      return `السلام عليكم ورحمة الله،\n${name ? `${name}، ` : ''}يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف ${groomName} & ${brideName} المبارك ✨\n\nلمشاهدة بطاقة دعوتكم الخاصة والتفاصيل وتأكيد الحضور:\n${url}\n\nحضوركم يسعدنا ويكتمل به سرورنا! 🤍`;
    }
    return `Greetings!\n${name ? `Dear ${name}, ` : ''}We cordially invite you to celebrate the wedding of ${groomName} & ${brideName} ✨\n\nPlease view your personalized invitation and confirm your RSVP at:\n${url}\n\nWe look forward to celebrating with you! 🤍`;
  };

  const handleCopySingle = () => {
    navigator.clipboard.writeText(singleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendWhatsAppSingle = () => {
    const text = encodeURIComponent(getWhatsAppMessage(guestName.trim(), singleUrl));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Bulk guest list processing
  const bulkGuests = bulkInput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const handleCopyAllBulk = () => {
    const listText = bulkGuests
      .map(name => `${name}: ${baseInviteUrl}?to=${encodeURIComponent(name)}`)
      .join('\n');
    navigator.clipboard.writeText(listText);
    setBulkCopied(true);
    setTimeout(() => setBulkCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden text-right" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-1.5">
              <span>مولّد روابط المعازيم المخصصة</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">مميز</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              أنشئ روابط دعوة خاصة باسم كل ضيف ليظهر اسمه في مقدمة الدعوة وتأكيد الحضور
            </p>
          </div>
        </div>

        {/* Tab Toggle: Single vs Bulk */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'single' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ضيف فردي
          </button>
          <button
            type="button"
            onClick={() => setMode('bulk')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'bulk' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            توليد جماعي (دفعة واحدة)
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {mode === 'single' ? (
          /* Single Guest Generator */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                اسم الضيف أو العائلة الكريمة:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="مثال: سعادة المستشار أحمد منصور أو عائلة الأستاذ محمد"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                سيظهر هذا الاسم في بطاقة الترحيب عند فتح الباب، وداخل بطاقة الدعوة الزجاجية، وسيُكتب تلقائياً في خانة تأكيد الحضور.
              </p>
            </div>

            {/* Generated Link Display */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-bold">الرابط المخصص للدعوة:</span>
                {guestName.trim() && (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3 h-3" />
                    مخصص لـ &quot;{guestName.trim()}&quot;
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={singleUrl}
                  className="w-full bg-white px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-600 select-all font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopySingle}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-sm"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'تم النسخ!' : 'نسخ'}</span>
                </button>
              </div>

              {/* Action Buttons: WhatsApp & Preview & Printable QR */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSendWhatsAppSingle}
                  className="px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال عبر واتساب برقعة دعوة جاهزة</span>
                </button>

                <a
                  href={singleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>معاينة الرابط</span>
                </a>

                <a
                  href={singleCardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  <span>بطاقة QR المخصصة</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Bulk Guest Generator */
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  اكتب أو الصق أسماء المعازيم (اسم واحد في كل سطر):
                </label>
                <span className="text-xs font-bold text-amber-700">
                  {bulkGuests.length} ضيف
                </span>
              </div>
              <textarea
                rows={5}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={`سعادة المستشار خالد المصري\nعائلة الأستاذ محمد عبد الرحمن\nالدكتور طارق السعيد\nالأستاذة مريم وزوجها`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs leading-relaxed focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-sans"
              />
            </div>

            {bulkGuests.length > 0 && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-800">
                    الروابط الجاهزة للإرسال ({bulkGuests.length}):
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyAllBulk}
                    className="px-3 py-1 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {bulkCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{bulkCopied ? 'تم نسخ جميع الروابط!' : 'نسخ كل القائمة'}</span>
                  </button>
                </div>

                {/* List of Guests */}
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {bulkGuests.map((name, idx) => {
                    const guestUrl = `${baseInviteUrl}?to=${encodeURIComponent(name)}`;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-stone-900 truncate">{name}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const msg = encodeURIComponent(getWhatsAppMessage(name, guestUrl));
                              window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
                            }}
                            className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all"
                            title="إرسال عبر واتساب"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(guestUrl);
                              alert(`تم نسخ رابط الدعوة الخاص بـ ${name}`);
                            }}
                            className="p-1.5 rounded-lg bg-stone-200 text-stone-700 hover:bg-stone-300 transition-all"
                            title="نسخ الرابط"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={guestUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-stone-200 text-stone-700 hover:bg-stone-300 transition-all"
                            title="معاينة"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
