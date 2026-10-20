import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { TemplateRenderContext } from '../../templates/types';
import { getTemplateImplementation } from '../../templates/registry';
import { formatEventDate } from '../../templates/utils/date';
import { AnalyticsProvider } from '../../templates/utils/AnalyticsProvider';
import { getPublicInvitation } from '../../lib/invitations';
import ExpiredInvitationScreen from '../../components/ExpiredInvitationScreen';

interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// ISR configuration - revalidate every 60 seconds
export const revalidate = 60;

async function fetchInvitation(slug: string) {
  return await getPublicInvitation(slug);
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const result = await fetchInvitation(params.slug);
  
  if (!result || result.type === 'NOT_FOUND') {
    return {
      title: 'Not Found',
      robots: { index: false, follow: false }
    };
  }

  if (result.type === 'EXPIRED') {
    return {
      title: 'انتهت صلاحية الدعوة | دعوة زفاف',
      description: 'نعتذر، لقد انتهت صلاحية رابط هذه الدعوة الإلكترونية.',
      robots: { index: false, follow: false }
    };
  }

  if (result.type === 'LEGACY_SLUG') {
    return {
      title: 'Wedding Invitation',
      robots: { index: true, follow: true }
    };
  }

  const { data } = result;
  const formattedDate = data.weddingDate ? formatEventDate(data.weddingDate, 'LTR') : '';
  const rawGuest = searchParams?.to || searchParams?.guest || searchParams?.name;
  const guestName = typeof rawGuest === 'string' ? decodeURIComponent(rawGuest).trim() : undefined;
  
  const title = guestName 
    ? `دعوة خاصة لـ ${guestName} | حفل زفاف ${data.groomName} & ${data.brideName}`
    : `${data.groomName} & ${data.brideName} | You're Invited!`;

  return {
    title,
    description: guestName 
      ? `يتشرف العروسان بدعوة ${guestName} لحضور حفل الزفاف في ${data.venueName}.`
      : `Join us for our wedding on ${formattedDate} at ${data.venueName}.`,
    openGraph: {
      title,
      description: `Join us for our wedding at ${data.venueName}.`,
      images: data.coverImage ? [data.coverImage.url] : [],
    },
    robots: { index: true, follow: true }
  };
}

export default async function PublicInvitationPage({ params, searchParams }: PageProps) {
  const result = await fetchInvitation(params.slug);

  if (!result || result.type === 'NOT_FOUND') {
    notFound();
  }

  if (result.type === 'LEGACY_SLUG') {
    redirect(`/${result.canonicalSlug}`);
  }

  // Handle Invitation Expiration (Minutes / Days limit reached)
  if (result.type === 'EXPIRED') {
    return <ExpiredInvitationScreen data={result.data} />;
  }

  const { data } = result;
  
  const registeredTemplate = getTemplateImplementation(data.template.slug);

  if (!registeredTemplate) {
    notFound();
  }

  const { component: TemplateComponent, metadata } = registeredTemplate;

  const customLang = (data.customData as any)?.language;
  const isArabic = customLang 
    ? customLang === 'ar' 
    : /[\u0600-\u06FF]/.test(data.groomName || data.brideName || '');
  const direction: 'LTR' | 'RTL' = isArabic ? 'RTL' : 'LTR';

  const rawGuest = searchParams?.to || searchParams?.guest || searchParams?.name;
  const guestName = typeof rawGuest === 'string' ? decodeURIComponent(rawGuest).trim() : undefined;

  const renderContext: TemplateRenderContext = {
    mode: 'PUBLIC',
    direction,
    data: {
      ...data,
      slug: params.slug,
      guestName
    } as any,
    metadata
  };

  return (
    <AnalyticsProvider slug={params.slug} isPublic={true}>
      <TemplateComponent {...renderContext} />
    </AnalyticsProvider>
  );
}
