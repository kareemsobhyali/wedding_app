import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { TemplateRenderContext } from '../../templates/types';
import { getTemplateImplementation } from '../../templates/registry';
import { formatEventDate } from '../../templates/utils/date';
import { AnalyticsProvider } from '../../templates/utils/AnalyticsProvider';

interface PageProps {
  params: { slug: string };
}

// ISR configuration - revalidate every 60 seconds
export const revalidate = 60;

async function fetchInvitation(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    const res = await fetch(`${apiUrl}/public/invitations/${slug}`, {
      next: { 
        revalidate: 60,
        tags: [`public-invitation-${slug}`]
      }
    });
    
    if (!res.ok) return null;
    const body = await res.json();
    return body.data || body;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await fetchInvitation(params.slug);
  
  if (!result || result.type !== 'FOUND') {
    return {
      title: 'Not Found',
      robots: { index: false, follow: false }
    };
  }

  const { data } = result;
  
  return {
    title: `${data.groomName} & ${data.brideName} | You're Invited!`,
    description: `Join us for our wedding on ${formatEventDate(data.weddingDate, 'LTR')} at ${data.venueName}.`,
    openGraph: {
      title: `${data.groomName} & ${data.brideName} | Wedding Invitation`,
      description: `Join us for our wedding at ${data.venueName}.`,
      images: data.coverImage ? [data.coverImage.url] : [],
    },
    robots: { index: true, follow: true }
  };
}

export default async function PublicInvitationPage({ params }: PageProps) {
  const result = await fetchInvitation(params.slug);

  if (!result) {
    notFound();
  }

  if (result.type === 'NOT_FOUND') {
    notFound();
  }

  if (result.type === 'LEGACY_SLUG') {
    redirect(`/${result.canonicalSlug}`);
  }

  const { data } = result;
  
  const registeredTemplate = getTemplateImplementation(data.template.slug);

  if (!registeredTemplate) {
    notFound(); // Fallback if template implementation is missing
  }

  const { component: TemplateComponent, metadata } = registeredTemplate;

  const renderContext: TemplateRenderContext = {
    mode: 'PUBLIC',
    direction: 'LTR',
    data,
    metadata
  };

  return (
    <AnalyticsProvider slug={params.slug} isPublic={true}>
      <TemplateComponent {...renderContext} />
    </AnalyticsProvider>
  );
}
