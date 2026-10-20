'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Users, 
  Send, 
  Trash2,
  Plus,
  ShieldCheck,
  Lock,
  Search
} from 'lucide-react';

interface PersonalizedLinksGeneratorProps {
  slug: string;
  groomName: string;
  brideName: string;
  isArabic?: boolean;
  initialAliases?: Record<string, string>;
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
  isArabic = true,
  initialAliases = {}
}: PersonalizedLinksGeneratorProps) {
  const [origin, setOrigin] = useState('');
  const [guestAliases, setGuestAliases] = useState<Record<string, string>>(initialAliases);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // New guest inputs
  const [guestName, setGuestName] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isAutoCode, setIsAutoCode] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk mode
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [bulkInput, setBulkInput] = useState('');
  const [useNumbers, setUseNumbers] = useState(false);
  const [bulkCopied, setBulkCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
    // Fetch latest aliases from API
    fetchAliases();
  }, [slug]);

  const fetchAliases = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/public/invitations/${slug}/guests`);
      if (res.ok) {
        const data = await res.json();
        if (data.guestAliases) {
          setGuestAliases(data.guestAliases);
        }
      }
    } catch (err) {
      console.error('Error fetching aliases:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate code when typing name
  useEffect(() => {
    if (isAutoCode && guestName.trim()) {
      const code = generateCleanCode(guestName.trim());
      setCustomCode(code);
    } else if (!guestName.trim() && isAutoCode) {
      setCustomCode('');
    }
  }, [guestName, isAutoCode]);

  const baseInviteUrl = origin ? `${origin}/${slug}` : `/${slug}`;

  const getWhatsAppMessage = (name: string, url: string) => {
    return `السلام عليكم ورحمة الله،\n${name ? `${name}، ` : ''}يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف ${groomName} & ${brideName} المبارك ✨\n\nلمشاهدة بطاقة دعوتكم الخاصة والتفاصيل وتأكيد الحضور:\n${url}\n\nحضوركم يسعدنا ويكتمل به سرورنا! 🤍`;
  };

  // Add single guest
  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = guestName.trim();
    const code = (customCode.trim() || generateCleanCode(name)).toLowerCase();
    if (!name || !code) return;

    try {
      setSaving(true);
      const res = await fetch(`/api/v1/public/invitations/${slug}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name })
      });
      if (res.ok) {
        const data = await res.json();
        setGuestAliases(data.guestAliases || { ...guestAliases, [code]: name });
        setGuestName('');
        setCustomCode('');
        setIsAutoCode(true);
      }
    } catch (err) {
      console.error('Error adding guest:', err);
    } finally {
      setSaving(false);
    }
  };

  // Delete guest
  const handleDeleteGuest = async (code: string) => {
    if (!confirm(`هل أنت متأكد من إلغاء وحذف الدعوة الخاصة بـ "${guestAliases[code]}"؟ لن يتمكن من فتحها بعد الحذف.`)) {
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/v1/public/invitations/${slug}/guests?code=${encodeURIComponent(code)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setGuestAliases(data.guestAliases || {});
      }
    } catch (err) {
      console.error('Error deleting guest:', err);
    } finally {
      setSaving(false);
    }
  };

  // Add bulk guests
  const handleAddBulk = async () => {
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return;

    const newAliases: Record<string, string> = {};
    const existingCount = Object.keys(guestAliases).length;

    lines.forEach((name, idx) => {
      let code = useNumbers 
        ? `${existingCount + idx + 1}` 
        : generateCleanCode(name);
      
      // Ensure unique code
      if (guestAliases[code] || newAliases[code]) {
        code = `${code}-${idx + 1}`;
      }
      newAliases[code] = name;
    });

    try {
      setSaving(true);
      const res = await fetch(`/api/v1/public/invitations/${slug}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aliases: newAliases })
      });
      if (res.ok) {
        const data = await res.json();
        setGuestAliases(data.guestAliases || { ...guestAliases, ...newAliases });
        setBulkInput('');
      }
    } catch (err) {
      console.error('Error adding bulk guests:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = (code: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Copy all active links list
  const handleCopyAllLinks = () => {
    const text = Object.entries(guestAliases)
      .map(([code, name]) => `${name}: ${baseInviteUrl}?to=${encodeURIComponent(code)}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setBulkCopied(true);
    setTimeout(() => setBulkCopied(false), 2500);
  };

  const filteredEntries = Object.entries(guestAliases).filter(([code, name]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || code.toLowerCase().includes(q);
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden text-right" dir="rtl">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-amber-50 to-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-stone-900">
                إدارة الدعوات الخاصة للمعازيم
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                خدمة مدفوعة 🔒
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              الدعوات المعتمدة في هذه القائمة فقط هي التي تفتح باسم الضيف، ولا يمكن للعميل أو المعزومين تزييف أو توليد دعوات من الرابط.
            </p>
          </div>
        </div>

        {/* Counter Badge & Mode Switch */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200">
            {Object.keys(guestAliases).length} دعوة خاصة نشطة
          </span>
          <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mode === 'single' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              إضافة فردية
            </button>
            <button
              type="button"
              onClick={() => setMode('bulk')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mode === 'bulk' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              إضافة جماعية
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">

        {/* ========================================================= */}
        {/* ADD GUEST FORM */}
        {/* ========================================================= */}
        {mode === 'single' ? (
          <form onSubmit={handleAddSingle} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>إضافة وتفعيل دعوة خاصة جديدة:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  اسم الضيف بالعربي (الذي سيظهر في الدعوة):
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="مثال: سعادة المستشار أحمد منصور"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-amber-600 bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    كود الرابط بالإنجليزية:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoCode(true);
                      if (guestName.trim()) setCustomCode(generateCleanCode(guestName.trim()));
                    }}
                    className="text-[10px] text-amber-700 font-bold hover:underline"
                  >
                    اقتراح تلقائي ✨
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={customCode}
                  onChange={(e) => {
                    setIsAutoCode(false);
                    setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase());
                  }}
                  placeholder="مثال: ahmed أو 1 أو vip1"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono text-stone-800 focus:outline-none focus:border-amber-600 bg-white text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-stone-500 font-mono" dir="ltr">
                {customCode ? `${baseInviteUrl}?to=${customCode}` : ''}
              </p>
              <button
                type="submit"
                disabled={saving || !guestName.trim()}
                className="px-4 py-2 bg-[#8C6D38] hover:bg-[#6E4D1D] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{saving ? 'جاري الحفظ...' : 'تفعيل وإضافة الدعوة'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-600" />
                <span>إضافة دفعة معازيم دفعة واحدة (Bulk):</span>
              </h4>
              <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600"
                />
                <span>استخدام أرقام (1, 2, 3...) للروابط</span>
              </label>
            </div>

            <textarea
              rows={4}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder={`أستاذ أحمد\nسعادة المستشار خالد المصري\nعائلة الأستاذ محمد عبد الرحمن\nالدكتور طارق السعيد`}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs leading-relaxed focus:outline-none focus:border-amber-600 bg-white font-sans"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddBulk}
                disabled={saving || !bulkInput.trim()}
                className="px-4 py-2 bg-[#8C6D38] hover:bg-[#6E4D1D] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{saving ? 'جاري الحفظ...' : 'تفعيل وإضافة جميع الأسماء'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* LIST OF ACTIVE AUTHORIZED GUESTS */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-stone-900">
                قائمة الدعوات الخاصة المعتمدة حالياً ({Object.keys(guestAliases).length}):
              </h4>
            </div>

            {Object.keys(guestAliases).length > 0 && (
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث في الأسماء..."
                    className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 w-36 sm:w-44 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCopyAllLinks}
                  className="px-3 py-1 bg-stone-800 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
                >
                  {bulkCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{bulkCopied ? 'تم النسخ!' : 'نسخ كل الروابط'}</span>
                </button>
              </div>
            )}
          </div>

          {Object.keys(guestAliases).length === 0 ? (
            <div className="py-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
              <UserCheck className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-stone-600">لا توجد دعوات خاصة مفعلة لهذه المناسبة بعد</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                استخدم النموذج أعلاه لإضافة وتفعيل أسماء المعازيم
              </p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-4">لا توجد نتائج مطابقة لبحثك.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
              {filteredEntries.map(([code, name], idx) => {
                const inviteUrl = `${baseInviteUrl}?to=${encodeURIComponent(code)}`;
                const isCopied = copiedCode === code;

                return (
                  <div
                    key={code}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200 transition-all text-xs"
                  >
                    {/* Guest Name & Code */}
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <div className="flex flex-col truncate">
                        <span className="font-bold text-stone-900 truncate">{name}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono" dir="ltr">
                          <span className="bg-stone-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-stone-700">
                            to={code}
                          </span>
                          <span className="truncate text-stone-400 text-[10px]">{inviteUrl}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Copy, WhatsApp, Preview, Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(code, inviteUrl)}
                        className="px-2.5 py-1.5 bg-white hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-2xs"
                        title="نسخ الرابط المخصص"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
                        <span className="hidden sm:inline">{isCopied ? 'تم النسخ' : 'نسخ'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const msg = encodeURIComponent(getWhatsAppMessage(name, inviteUrl));
                          window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
                        }}
                        className="p-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg transition-all shadow-2xs"
                        title="إرسال عبر واتساب"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={inviteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-white hover:bg-stone-200 text-stone-600 border border-stone-200 rounded-lg transition-all"
                        title="معاينة الدعوة بالاسم"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {/* Delete / Cancel Authorization Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteGuest(code)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition-all"
                        title="إلغاء وحذف هذه الدعوة الخاصة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
