'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTemplateImplementation } from '../../../../templates/registry';

const TEMPLATES = [
  { id: 'c74c4c9e-f366-4fdf-92a1-12811853537d', slug: 'butterfly-elegance', name: '🦋 Butterfly Elegance (فراشة الأناقة)' },
  { id: 'f69bd5fb-f983-4204-a437-ede28e7b1737', slug: 'heavenly-roses', name: '🌹 Heavenly Roses' },
  { id: 'c82fe0bb-703c-406b-a58b-2780ae744f1d', slug: 'classic-elegance', name: '✨ Classic Elegance' },
  { id: 'c523c967-3019-4ec9-942b-5db2cfafbc4c', slug: 'modern-minimalist', name: '🖤 Modern Minimalist' },
  { id: '6190bf5e-4910-49f1-86d8-a54ddd250cd6', slug: 'floral-romance', name: '🌸 Floral Romance' },
  { id: '3d4b512f-d07e-4344-b3a8-dfcaac710659', slug: 'botanical-rustic', name: '🌿 Botanical Rustic' },
  { id: '5cf7e077-5f2a-4302-b722-063aeece0f98', slug: 'golden-arabic', name: '⚜️ Golden Arabic' },
];

export default function AdminEditForm({ invitation, apiToken }: { invitation: any, apiToken: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    version: invitation.version,
    templateId: invitation.templateId || '',
    groomName: invitation.groomName || '',
    brideName: invitation.brideName || '',
    weddingDate: invitation.weddingDate ? new Date(invitation.weddingDate).toISOString().split('T')[0] : '',
    venueName: invitation.venueName || '',
    venueAddress: invitation.venueAddress || '',
    googleMapsUrl: invitation.googleMapsUrl || '',
    caption: invitation.caption || '',
    weddingMessage: invitation.weddingMessage || '',
    groomPhone: invitation.groomPhone || '',
    bridePhone: invitation.bridePhone || '',
    customData: invitation.customData || {},
  });

  React.useEffect(() => {
    setFormData({
      version: invitation.version,
      templateId: invitation.templateId || '',
      groomName: invitation.groomName || '',
      brideName: invitation.brideName || '',
      weddingDate: invitation.weddingDate ? new Date(invitation.weddingDate).toISOString().split('T')[0] : '',
      venueName: invitation.venueName || '',
      venueAddress: invitation.venueAddress || '',
      googleMapsUrl: invitation.googleMapsUrl || '',
      caption: invitation.caption || '',
      weddingMessage: invitation.weddingMessage || '',
      groomPhone: invitation.groomPhone || '',
      bridePhone: invitation.bridePhone || '',
      customData: invitation.customData || {},
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
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
          customData: formData.customData,
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

      <div>
        <label className="block text-sm font-medium">Maps URL</label>
        <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Custom Title (e.g. دعوة زفاف)</label>
        <input name="caption" value={formData.caption} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Custom Quote / Message</label>
        <textarea name="weddingMessage" value={formData.weddingMessage} onChange={handleChange} rows={3} className="w-full p-2 border rounded" />
      </div>

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

      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded font-bold disabled:opacity-50">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
