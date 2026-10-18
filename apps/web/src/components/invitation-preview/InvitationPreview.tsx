import React, { useState } from 'react';
import { InvitationRenderData, TemplateRenderContext } from '../../templates/types';
import { getTemplateImplementation } from '../../templates/registry';

export type DeviceMode = 'MOBILE' | 'TABLET' | 'DESKTOP';

interface InvitationPreviewProps {
  data: InvitationRenderData;
  templateId: string;
  saveState?: 'idle' | 'saving' | 'saved' | 'error';
}

const DEVICE_DIMENSIONS = {
  MOBILE: { width: 390, height: 844 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1440, height: 900 }
};

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({ data, templateId, saveState }) => {
  const [device, setDevice] = useState<DeviceMode>('MOBILE');

  const registeredTemplate = getTemplateImplementation(templateId);

  if (!registeredTemplate) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
        Template missing or inactive. Debug templateId: "{templateId}". Draft Keys: "{Object.keys(data || {}).join(', ')}"
      </div>
    );
  }

  const { component: TemplateComponent, metadata } = registeredTemplate;

  
  const mediaArr = (data as any).media || [];
  const coverMedia = mediaArr.find((m: any) => m.role === "COVER");
  const musicMedia = mediaArr.find((m: any) => m.type === "AUDIO");

  const renderData: InvitationRenderData = {
    ...data,
    googleMapsUrl: data.googleMapsUrl || (data as any).mapsUrl,
    groomPhone: data.groomPhone || (data as any).groomContact,
    bridePhone: data.bridePhone || (data as any).brideContact,
    music: musicMedia ? { url: musicMedia.publicUrl || musicMedia.storageKey } : data.music,
    coverImage: coverMedia ? { url: coverMedia.publicUrl || coverMedia.storageKey, alt: "Cover" } : data.coverImage,
    galleryImages: data.galleryImages || mediaArr.filter((m: any) => m.role === "GALLERY").map((m: any) => ({ url: m.publicUrl || m.storageKey, alt: "Gallery" })),
  };

  const renderContext: TemplateRenderContext = {
    mode: 'PREVIEW',
    direction: 'LTR', 
    data: renderData,
    metadata
  };

  const dim = DEVICE_DIMENSIONS[device];

  // We wrap the template in a constrained container that forces the logical width/height.
  // We use CSS scale to make it fit visually within the right-side dashboard panel.
  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white shrink-0 shadow-md">
        <div className="flex gap-2">
          {(['MOBILE', 'TABLET', 'DESKTOP'] as DeviceMode[]).map(d => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`px-3 py-1 text-xs rounded transition-colors ${device === d ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              aria-label={`Preview on ${d}`}
            >
              {d === 'MOBILE' ? '📱 Mobile' : d === 'TABLET' ? '📲 Tablet' : '🖥 Desktop'}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-400">
          {saveState === 'saving' && 'Saving...'}
          {saveState === 'saved' && 'Saved'}
          {saveState === 'error' && <span className="text-red-400">Save Failed</span>}
        </div>
      </div>

      {/* Viewport Sandbox */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
        <div 
          className="relative bg-white shadow-2xl transition-all duration-300 origin-top"
          style={{
            width: dim.width,
            height: dim.height,
            // Visually scale down if the screen is too small to fit the logical dimensions
            // A production polished setup would use a ResizeObserver to calculate scale precisely,
            // For V1 architectural starter, we rely on responsive wrapping.
            transform: device === 'DESKTOP' ? 'scale(0.6)' : device === 'TABLET' ? 'scale(0.8)' : 'scale(1)',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <TemplateComponent {...renderContext} />
        </div>
      </div>
    </div>
  );
};
