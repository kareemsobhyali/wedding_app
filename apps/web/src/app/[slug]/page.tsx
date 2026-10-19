import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { TemplateRenderContext } from '../../templates/types';
import { getTemplateImplementation } from '../../templates/registry';
import { formatEventDate } from '../../templates/utils/date';
import { AnalyticsProvider } from '../../templates/utils/AnalyticsProvider';
import { getPublicInvitation } from '../../lib/invitations';

interface PageProps {
  params: { slug: string };
}

// ISR configuration - revalidate every 60 seconds
export const revalidate = 60;

async function fetchInvitation(slug: string) {
  return await getPublicInvitation(slug);
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
  const formattedDate = data.weddingDate ? formatEventDate(data.weddingDate, 'LTR') : '';
  
  return {
    title: `${data.groomName} & ${data.brideName} | You're Invited!`,
    description: `Join us for our wedding on ${formattedDate} at ${data.venueName}.`,
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

  if (!result || result.type === 'NOT_FOUND') {
    notFound();
  }

  if (result.type === 'LEGACY_SLUG') {
    redirect(`/${result.canonicalSlug}`);
  }

  const { data } = result;
  
  const registeredTemplate = getTemplateImplementation(data.template.slug);

  if (!registeredTemplate) {
    notFound();
  }

  const { component: TemplateComponent, metadata } = registeredTemplate;

  const renderContext: TemplateRenderContext = {
    mode: 'PUBLIC',
    direction: 'LTR',
    data: data as any,
    metadata
  };

  return (
    <AnalyticsProvider slug={params.slug} isPublic={true}>
      <TemplateComponent {...renderContext} />
    </AnalyticsProvider>
  );
}
