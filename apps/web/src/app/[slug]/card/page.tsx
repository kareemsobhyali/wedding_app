import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getPublicInvitation, resolveGuestName } from '../../../lib/invitations';
import ExpiredInvitationScreen from '../../../components/ExpiredInvitationScreen';
import PrintableQrCard from '../../../components/PrintableQrCard';

interface CardPageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const revalidate = 60;

export async function generateMetadata({ params, searchParams }: CardPageProps): Promise<Metadata> {
  const result = await getPublicInvitation(params.slug);

  if (!result || result.type !== 'FOUND') {
    return { title: 'بطاقة الدعوة QR' };
  }

  const { data } = result;
  const guestName = resolveGuestName(searchParams, data.customData);

  const title = guestName
    ? `بطاقة دعوة خاصة لـ ${guestName} | ${data.groomName} & ${data.brideName}`
    : `بطاقة الدعوة ورمز QR | ${data.groomName} & ${data.brideName}`;

  return {
    title,
    description: `امسح رمز QR للدخول إلى حفل زفاف ${data.groomName} & ${data.brideName}.`,
    openGraph: {
      title,
      description: `حفل زفاف ${data.groomName} & ${data.brideName} في ${data.venueName}.`
    }
  };
}

export default async function InvitationCardPage({ params, searchParams }: CardPageProps) {
  const result = await getPublicInvitation(params.slug);

  if (!result || result.type === 'NOT_FOUND') {
    notFound();
  }

  if (result.type === 'LEGACY_SLUG') {
    redirect(`/${result.canonicalSlug}/card`);
  }

  if (result.type === 'EXPIRED') {
    return <ExpiredInvitationScreen data={result.data} />;
  }

  const { data } = result;
  const guestName = resolveGuestName(searchParams, data.customData);

  const customLang = (data.customData as any)?.language;
  const isAr = customLang 
    ? customLang === 'ar' 
    : /[\u0600-\u06FF]/.test(data.groomName || data.brideName || '');

  return (
    <PrintableQrCard
      slug={params.slug}
      groomName={data.groomName}
      brideName={data.brideName}
      weddingDate={data.weddingDate || new Date()}
      weddingTime={(data.customData as any)?.weddingTime || (data.customData as any)?.ceremonyTime}
      venueName={data.venueName}
      venueAddress={data.venueAddress || undefined}
      guestName={guestName}
      language={isAr ? 'ar' : 'en'}
    />
  );
}
