export type TemplateFeature = 
  | 'HERO'
  | 'GALLERY'
  | 'MUSIC'
  | 'COUNTDOWN'
  | 'VENUE'
  | 'MAPS'
  | 'CONTACTS'
  | 'CUSTOM_MESSAGE'
  | 'SHARE';

export type RenderMode = 'PREVIEW' | 'PUBLIC';
export type RenderDirection = 'LTR' | 'RTL';

export interface MediaViewModel {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface AudioViewModel {
  url: string;
  title?: string;
}

export interface InvitationRenderData {
  groomName: string;
  brideName: string;
  weddingDate: Date;
  weddingTime?: string;
  venueName: string;
  venueAddress?: string;
  googleMapsUrl?: string;
  
  caption?: string;
  weddingMessage?: string;
  
  groomPhone?: string;
  bridePhone?: string;
  groomWhatsapp?: string;
  brideWhatsapp?: string;
  
  countdownEnabled: boolean;
  contactButtonsEnabled: boolean;
  
  coverImage?: MediaViewModel;
  groomImage?: MediaViewModel;
  brideImage?: MediaViewModel;
  galleryImages: MediaViewModel[];
  
  music?: AudioViewModel;
  customData?: Record<string, any>;
}

export interface TemplateCustomField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'color' | 'date';
  defaultValue?: string;
}

export interface TemplateMetadata {
  id: string; // The stable identifier, e.g. 'classic-elegance'
  name: string;
  description: string;
  previewImage: string;
  version: string;
  supportedFeatures: TemplateFeature[];
  customFields?: TemplateCustomField[];
}

export interface TemplateRenderContext {
  mode: RenderMode;
  direction: RenderDirection;
  data: InvitationRenderData;
  metadata: TemplateMetadata;
  trackEvent?: (eventType: string) => void;
}
