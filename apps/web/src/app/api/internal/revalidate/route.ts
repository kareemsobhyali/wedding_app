import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret) {
      return NextResponse.json({ error: 'Revalidation not configured' }, { status: 501 });
    }

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tags } = await req.json();

    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: 'Tags array is required' }, { status: 400 });
    }

    for (const tag of tags) {
      // Validate tag format
      if (typeof tag === 'string' && tag.startsWith('public-invitation-')) {
        revalidateTag(tag);
      }
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
