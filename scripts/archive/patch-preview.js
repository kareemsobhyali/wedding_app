const fs = require("fs");
let c = fs.readFileSync("apps/web/src/components/invitation-preview/InvitationPreview.tsx", "utf8");

const replacement = `
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
`;

c = c.replace(/const renderData: InvitationRenderData = \{[\s\S]*?\};\n/, replacement);
fs.writeFileSync("apps/web/src/components/invitation-preview/InvitationPreview.tsx", c);

