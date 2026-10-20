import { prisma } from './prisma';

export async function getPublicInvitation(slug: string) {
  try {
    const slugRecord = await prisma.invitationSlug.findUnique({
      where: { slug },
      include: {
        invitation: {
          include: {
            template: true,
            media: {
              where: { deletedAt: null },
              orderBy: { sortOrder: 'asc' }
            },
            slugs: true
          }
        }
      }
    });

    if (!slugRecord || !slugRecord.invitation) {
      return { type: 'NOT_FOUND' as const };
    }

    if (!slugRecord.isCurrent) {
      const currentSlug = slugRecord.invitation.slugs.find((s) => s.isCurrent);
      if (currentSlug) {
        return {
          type: 'LEGACY_SLUG' as const,
          canonicalSlug: currentSlug.slug
        };
      }
    }

    const inv = slugRecord.invitation;

    // Check Expiration System (Valid until expiresAt or if status is EXPIRED)
    const isExpired = inv.status === 'EXPIRED' || (inv.expiresAt && new Date() > new Date(inv.expiresAt));
    if (isExpired) {
      return {
        type: 'EXPIRED' as const,
        data: {
          id: inv.id,
          groomName: inv.groomName,
          brideName: inv.brideName,
          weddingDate: inv.weddingDate || new Date(),
          expiresAt: inv.expiresAt,
          customerPhone: inv.customerPhone
        }
      };
    }

    const media = inv.media || [];
    const coverMedia = media.find((m) => m.role === 'COVER');
    const audioMedia = media.find((m) => m.type === 'AUDIO');
    const galleryMedia = media.filter((m) => m.role === 'GALLERY');

    return {
      type: 'FOUND' as const,
      data: {
        id: inv.id,
        groomName: inv.groomName,
        brideName: inv.brideName,
        weddingDate: inv.weddingDate || new Date(),
        weddingTime: (inv.customData as any)?.weddingTime || '',
        venueName: inv.venueName || '',
        venueAddress: inv.venueAddress || '',
        googleMapsUrl: inv.googleMapsUrl || '',
        customerPhone: inv.customerPhone,
        countdownEnabled: inv.countdownEnabled ?? true,
        contactButtonsEnabled: inv.contactButtonsEnabled ?? true,
        groomPhone: inv.groomPhone || '',
        bridePhone: inv.bridePhone || '',
        caption: inv.caption || '',
        weddingMessage: inv.weddingMessage || '',
        customData: (inv.customData as Record<string, any>) || {},
        coverImage: coverMedia ? { url: coverMedia.publicUrl || coverMedia.storageKey, alt: 'Cover' } : undefined,
        music: audioMedia ? { url: audioMedia.publicUrl || audioMedia.storageKey } : undefined,
        galleryImages: galleryMedia.map((m) => ({ url: m.publicUrl || m.storageKey, alt: 'Gallery Image' })),
        template: {
          id: inv.template?.id || '',
          name: inv.template?.name || '',
          slug: inv.template?.slug || 'butterfly-elegance'
        },
        media: inv.media
      }
    };
  } catch (error) {
    console.error('Error fetching public invitation by slug:', error);
    return { type: 'NOT_FOUND' as const };
  }
}
