import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Limit file size to 50MB
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ message: 'File size exceeds 50MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || (file.type.startsWith('audio') ? '.mp3' : '.jpg');
    const rawBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
    const safeBase = rawBase.slice(0, 40) || 'file';
    const filename = `${Date.now()}-${safeBase}${ext}`;

    // Determine upload directory: prioritize existing public directory
    let publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      publicDir = path.join(process.cwd(), 'apps', 'web', 'public');
    }
    const uploadDir = path.join(publicDir, 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ message: error.message || 'File upload failed' }, { status: 500 });
  }
}
