'use client';
import React, { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Settings saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDemoLinkChange = (templateId: string, url: string) => {
    setSettings((prev: any) => ({
      ...prev,
      demoLinks: {
        ...(prev.demoLinks || {}),
        [templateId]: url
      }
    }));
  };

  const handlePreviewImageChange = (templateId: string, url: string) => {
    setSettings((prev: any) => ({
      ...prev,
      previewImages: {
        ...(prev.previewImages || {}),
        [templateId]: url
      }
    }));
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  const templateIds = [
    'butterfly-elegance',
    'golden-arabic',
    'classic-elegance',
    'modern-minimalist',
    'floral-romance',
    'botanical-rustic',
    'royal-velvet',
    'palace-gates',
    'celestial-stardust',
    'pearl-box',
    'story-vogue-editorial',
    'story-royal-emerald',
    'story-boho-terracotta',
    'wax-silk-reveal',
    'arabian-crescent-lantern',
    'laser-gold-gatefold',
    'vintage-calla-blooms',
    'blooming-garden-3d',
    'pearl-silk-minimalist',
    'luxury-flip-card',
    'boarding-pass-vip',
    'luxury-booklet-editorial',
    'royal-scroll',
    'velvet-jewelry-box',
    'vintage-vinyl-player',
    'polaroid-photo-reel',
    'celestial-constellations',
    'classic-lined-envelope',
    'deckle-edge-cotton',
    'vellum-silk-wrap',
    'acrylic-glass-card',
    'trifold-pocket-folio',
    'sculpted-porcelain-arch',
    'cathedral-grand-arch',
    'mughal-palace-portal'
  ];

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto font-cairo">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 shadow rounded-lg border border-gray-100">
        
        {/* Global Settings */}
        <div>
          <h2 className="text-xl font-bold border-b pb-2 mb-4 text-indigo-900">Global Settings</h2>
          <div>
            <label className="block text-sm font-bold mb-1">Site Name</label>
            <input 
              className="w-full border p-2 rounded" 
              value={settings.siteName || ''} 
              onChange={e => setSettings({...settings, siteName: e.target.value})} 
              dir="rtl"
              placeholder="دعوتي Daawati"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div>
          <h2 className="text-xl font-bold border-b pb-2 mb-4 text-indigo-900">Hero Section</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Hero Title</label>
              <input 
                className="w-full border p-2 rounded" 
                value={settings.heroTitle || ''} 
                onChange={e => setSettings({...settings, heroTitle: e.target.value})} 
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Hero Subtitle</label>
              <textarea 
                className="w-full border p-2 rounded h-24" 
                value={settings.heroSubtitle || ''} 
                onChange={e => setSettings({...settings, heroSubtitle: e.target.value})}
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold border-b pb-2 mb-4 text-indigo-900">About Section</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">About Title</label>
              <input 
                className="w-full border p-2 rounded" 
                value={settings.aboutTitle || ''} 
                onChange={e => setSettings({...settings, aboutTitle: e.target.value})} 
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">About Text</label>
              <textarea 
                className="w-full border p-2 rounded h-24" 
                value={settings.aboutText || ''} 
                onChange={e => setSettings({...settings, aboutText: e.target.value})}
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-bold border-b pb-2 mb-4 text-indigo-900">Contact & Socials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">WhatsApp Number</label>
              <input 
                className="w-full border p-2 rounded" 
                value={settings.contactWhatsApp || ''} 
                onChange={e => setSettings({...settings, contactWhatsApp: e.target.value})}
                dir="ltr"
                placeholder="+201000000000"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Email Address</label>
              <input 
                className="w-full border p-2 rounded" 
                value={settings.contactEmail || ''} 
                onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                dir="ltr"
                placeholder="contact@domain.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-1">Instagram URL</label>
              <input 
                className="w-full border p-2 rounded" 
                value={settings.contactInstagram || ''} 
                onChange={e => setSettings({...settings, contactInstagram: e.target.value})}
                dir="ltr"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Template Overrides */}
        <div>
          <h2 className="text-xl font-bold border-b pb-2 mb-4 text-indigo-900">Template Settings</h2>
          <p className="text-sm text-gray-500 mb-4">Set custom demo links and preview image URLs for your themes. Leave empty to use defaults.</p>
          <div className="space-y-6">
            {templateIds.map(tplId => (
              <div key={tplId} className="bg-gray-50 p-4 rounded border grid gap-4">
                <div className="font-bold text-gray-800">{tplId}</div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Demo Link URL</label>
                    <input 
                      className="w-full border p-2 rounded text-sm" 
                      value={settings.demoLinks?.[tplId] || ''} 
                      onChange={e => handleDemoLinkChange(tplId, e.target.value)}
                      dir="ltr"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Custom Preview Image URL</label>
                    <input 
                      className="w-full border p-2 rounded text-sm" 
                      value={settings.previewImages?.[tplId] || ''} 
                      onChange={e => handlePreviewImageChange(tplId, e.target.value)}
                      dir="ltr"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
