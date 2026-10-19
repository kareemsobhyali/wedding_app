import { NextResponse } from 'next/server';
import { getPublicInvitation } from '@/lib/invitations';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const result = await getPublicInvitation(params.slug);
  if (result.type === 'NOT_FOUND') {
    return NextResponse.json({ type: 'NOT_FOUND' }, { status: 404 });
  }
  return NextResponse.json(result);
}
