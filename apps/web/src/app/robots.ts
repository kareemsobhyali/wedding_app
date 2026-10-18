import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // Public invitations should be indexable, but administrative paths should not
      allow: '/',
      disallow: [
        '/admin',
        '/admin-login',
        '/create',
        '/create/success',
        '/api/',
      ],
    },
    // Optional: Add sitemap url if generating one
    // sitemap: 'https://wedding.com/sitemap.xml',
  };
}
