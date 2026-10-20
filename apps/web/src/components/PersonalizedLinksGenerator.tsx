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
  Link as LinkIcon,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface PersonalizedLinksGeneratorProps {
  slug: string;
  groomName: string;
  brideName: string;
  isArabic?: boolean;
}

// Arabic to clean English transliteration helper
function generateCleanCode(arabicName: string): string {
  const commonNames: Record<string, string> = {
    'أحمد': 'ahmed', 'احمد': 'ahmed', 'محمد': 'mohamed', 'محمود': 'mahmoud',
    'علي': 'ali', 'خالد': 'khaled', 'طارق': 'tarek', 'يوسف': 'youssef',
    'إبراهيم': 'ibrahim', 'ابراهيم': 'ibrahim', 'حسن': 'hassan', 'حسين': 'hussein',
    'عمر': 'omar', 'عمرو': 'amr', 'كريم': 'karim', 'مصطفى': 'mostafa',
    'سارة': 'sara', 'ساره': 'sara', 'مريم': 'mariam', 'فاطمة': 'fatma',
    'نور': 'nour', 'هدى': 'hoda', 'ياسمين': 'yasmin', 'منى': 'mona',
    'أميرة': 'amira', 'اميرة': 'amira', 'دعاء': 'doaa', 'رنا': 'rana',
    'عبد الرحمن': 'abdelrahman', 'عبد الله': 'abdullah', 'عبدالرحمن': 'abdelrahman',
    'عبدالله': 'abdullah', 'هاني': 'hany', 'وائل': 'wael', 'سامح': 'sameh'
  };

  // Strip honorary prefixes
  const cleaned = arabicName
    .replace(/(سعادة|معالي|سيادة|المستشار|الدكتور|دكتور|د\.|الأستاذ|الاستاذ|أستاذ|استاذ|المهندس|مهندس|م\.|الشيخ|شيخ|الحاج|عائلة|آل)\s+/gi, '')
    .trim();

  const words = cleaned.split(/\s+/);
  const parts: string[] = [];

  for (const w of words.slice(0, 2)) {
    if (commonNames[w]) {
      parts.push(commonNames[w]);
    } else {
      const transliterated = w
        .replace(/[أإآا]/g, 'a')
        .replace(/ب/g, 'b')
        .replace(/ت/g, 't')
        .replace(/ث/g, 'th')
        .replace(/ج/g, 'g')
        .replace(/ح/g, 'h')
        .replace(/خ/g, 'kh')
        .replace(/د/g, 'd')
        .replace(/ذ/g, 'z')
        .replace(/ر/g, 'r')
        .replace(/ز/g, 'z')
        .replace(/س/g, 's')
        .replace(/ش/g, 'sh')
        .replace(/ص/g, 's')
        .replace(/ض/g, 'd')
        .replace(/ط/g, 't')
        .replace(/ظ/g, 'z')
        .replace(/ع/g, 'a')
        .replace(/غ/g, 'gh')
        .replace(/ف/g, 'f')
        .replace(/ق/g, 'k')
        .replace(/ك/g, 'k')
        .replace(/ل/g, 'l')
        .replace(/م/g, 'm')
        .replace(/ن/g, 'n')
        .replace(/ه|ة/g, 'h')
        .replace(/و/g, 'w')
        .replace(/[يىئ]/g, 'y')
        .replace(/[^a-zA-Z0-9]/g, '');
      if (transliterated) parts.push(transliterated);
    }
  }

  return parts.join('-').toLowerCase() || 'vip';
}

export default function PersonalizedLinksGenerator({
  slug,
  groomName,
  brideName,
  isArabic = true
}: PersonalizedLinksGeneratorProps) {
  const [origin, setOrigin] = useState('');
  const [guestName, setGuestName] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isAutoCode, setIsAutoCode] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [bulkInput, setBulkInput] = useState('');
  const [bulkCopied, setBulkCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [useNumbers, setUseNumbers] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Update auto code when guest name changes if user hasn't typed custom code
  useEffect(() => {
    if (isAutoCode && guestName.trim()) {
      const code = generateCleanCode(guestName.trim());
      setCustomCode(code);
    } else if (!guestName.trim() && isAutoCode) {
      setCustomCode('');
    }
  }, [guestName, isAutoCode]);

  const baseInviteUrl = origin ? `${origin}/${slug}` : `/${slug}`;

  // Active code for single guest (clean English code or fallback)
  const activeCode = (customCode.trim() || generateCleanCode(guestName.trim())).toLowerCase();

  // Clean short URL (e.g. domain.com/slug?to=ahmed)
  const cleanSingleUrl = activeCode
    ? `${baseInviteUrl}?to=${encodeURIComponent(activeCode)}`
    : baseInviteUrl;

  const singleCardUrl = activeCode
    ? `${origin || ''}/${slug}/card?to=${encodeURIComponent(activeCode)}`
    : `${origin || ''}/${slug}/card`;

  // Save alias to backend database
  const saveAlias = async (code: string, name: string) => {
    if (!code || !name) return;
    try {
      setIsSaving(true);
      await fetch(`/api/v1/public/invitations/${slug}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name })
      });
    } catch (err) {
      console.error('Error saving guest alias:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getWhatsAppMessage = (name: string, url: string) => {
    if (isArabic) {
      return `السلام عليكم ورحمة الله،\n${name ? `${name}، ` : ''}يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف ${groomName} & ${brideName} المبارك ✨\n\nلمشاهدة بطاقة دعوتكم الخاصة والتفاصيل وتأكيد الحضور:\n${url}\n\nحضوركم يسعدنا ويكتمل به سرورنا! 🤍`;
    }
    return `Greetings!\n${name ? `Dear ${name}, ` : ''}We cordially invite you to celebrate the wedding of ${groomName} & ${brideName} ✨\n\nPlease view your personalized invitation and confirm your RSVP at:\n${url}\n\nWe look forward to celebrating with you! 🤍`;
  };

  const handleCopySingle = async () => {
    if (activeCode && guestName.trim()) {
      saveAlias(activeCode, guestName.trim());
    }
    navigator.clipboard.writeText(cleanSingleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendWhatsAppSingle = () => {
    if (activeCode && guestName.trim()) {
      saveAlias(activeCode, guestName.trim());
    }
    const text = encodeURIComponent(getWhatsAppMessage(guestName.trim(), cleanSingleUrl));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Bulk guest list processing with clean codes
  const bulkGuests = bulkInput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const bulkAliases: Record<string, string> = {};
  const bulkItems = bulkGuests.map((name, idx) => {
    const code = useNumbers ? `${idx + 1}` : `${generateCleanCode(name)}${bulkGuests.filter((_, i) => i < idx && generateCleanCode(_) === generateCleanCode(name)).length ? `-${idx + 1}` : ''}`;
    bulkAliases[code] = name;
    const url = `${baseInviteUrl}?to=${encodeURIComponent(code)}`;
    return { name, code, url };
  });

  const saveAllBulkAliases = async () => {
    if (Object.keys(bulkAliases).length === 0) return;
    try {
      setIsSaving(true);
      await fetch(`/api/v1/public/invitations/${slug}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aliases: bulkAliases })
      });
    } catch (err) {
      console.error('Error saving bulk aliases:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyAllBulk = async () => {
    await saveAllBulkAliases();
    const listText = bulkItems
      .map(item => `${item.name}: ${item.url}`)
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
              <span>مولّد روابط المعازيم النظيفة والمخصصة</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">روابط نظيفة بدون رموز %</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              روابط قصيرة وأنيقة بالإنجليزية مع إظهار الاسم الكامل بالعربي الفاخر داخل الدعوة
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
            توليد جماعي
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {mode === 'single' ? (
          /* Single Guest Generator */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  1. اسم الضيف بالعربي (يظهر في الدعوة):
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="مثال: أستاذ أحمد أو سعادة المستشار خالد"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    2. كود الرابط بالإنجليزية (بدون رموز غريبة):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoCode(true);
                      if (guestName.trim()) setCustomCode(generateCleanCode(guestName.trim()));
                    }}
                    className="text-[11px] text-amber-700 font-bold hover:underline"
                  >
                    اقتراح تلقائي ✨
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => {
                      setIsAutoCode(false);
                      setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase());
                    }}
                    placeholder="مثال: ahmed أو 1 أو vip"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono text-stone-800 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Link Preview Plaque */}
            <div className="p-3.5 rounded-xl bg-gradient-to-b from-stone-50 to-[#FAF8F5] border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-bold flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الرابط النظيف الجاهز للإرسال (شكل فخم ومختصر):</span>
                </span>
                {guestName.trim() && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    يفتح باسم: &quot;{guestName.trim()}&quot;
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={cleanSingleUrl}
                  className="w-full bg-white px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-200 text-stone-700 select-all font-mono text-left font-semibold"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleCopySingle}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-sm"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>

              {/* Action Buttons: WhatsApp & Preview & Printable QR */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSendWhatsAppSingle}
                  className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال عبر واتساب برقعة دعوة جاهزة</span>
                </button>

                <a
                  href={cleanSingleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (activeCode && guestName.trim()) saveAlias(activeCode, guestName.trim());
                  }}
                  className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>معاينة الرابط</span>
                </a>

                <a
                  href={singleCardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  <span>بطاقة QR للطباعة</span>
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
                  الصق أسماء المعازيم بالعربي (اسم واحد في كل سطر):
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useNumbers}
                      onChange={(e) => setUseNumbers(e.target.checked)}
                      className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>استخدام أرقام (1, 2, 3...)</span>
                  </label>
                  <span className="text-xs font-bold text-amber-700">
                    {bulkGuests.length} ضيف
                  </span>
                </div>
              </div>
              <textarea
                rows={5}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={`أستاذ أحمد\nسعادة المستشار خالد المصري\nعائلة الأستاذ محمد عبد الرحمن\nالدكتور طارق السعيد`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs leading-relaxed focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-sans"
              />
            </div>

            {bulkItems.length > 0 && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-800">
                    الروابط النظيفة الجاهزة ({bulkItems.length}):
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyAllBulk}
                    className="px-3 py-1 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {bulkCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{bulkCopied ? 'تم نسخ وحفظ جميع الروابط!' : 'نسخ وحفظ كل القائمة'}</span>
                  </button>
                </div>

                {/* List of Clean Guests Links */}
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {bulkItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                          {idx + 1}
                        </span>
                        <div className="flex flex-col truncate">
                          <span className="font-bold text-stone-900 truncate">{item.name}</span>
                          <span className="text-[10px] text-stone-500 font-mono" dir="ltr">{item.url}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={async () => {
                            await saveAlias(item.code, item.name);
                            const msg = encodeURIComponent(getWhatsAppMessage(item.name, item.url));
                            window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
                          }}
                          className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all"
                          title="إرسال عبر واتساب"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            await saveAlias(item.code, item.name);
                            navigator.clipboard.writeText(item.url);
                            alert(`تم نسخ الرابط النظيف الخاص بـ ${item.name}`);
                          }}
                          className="p-1.5 rounded-lg bg-stone-200 text-stone-700 hover:bg-stone-300 transition-all"
                          title="نسخ الرابط"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => saveAlias(item.code, item.name)}
                          className="p-1.5 rounded-lg bg-stone-200 text-stone-700 hover:bg-stone-300 transition-all"
                          title="معاينة"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
