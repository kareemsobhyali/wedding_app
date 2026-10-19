import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const candidates = [
      path.resolve(process.cwd(), '../../packages/database/prisma/schema.prisma'),
      path.resolve(process.cwd(), 'packages/database/prisma/schema.prisma'),
      path.resolve(__dirname, '../../../../../../packages/database/prisma/schema.prisma')
    ];
    const schemaPath = candidates.find(p => fs.existsSync(p));

    if (!schemaPath) {
      return NextResponse.json({
        success: false,
        message: 'schema.prisma not found in candidate paths',
        candidates
      }, { status: 500 });
    }

    const output = execSync(`npx --yes prisma db push --schema="${schemaPath}" --accept-data-loss`, {
      encoding: 'utf8',
      env: { ...process.env },
      timeout: 45000
    });

    return NextResponse.json({
      success: true,
      message: 'Prisma DB push completed successfully!',
      output
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      stdout: error.stdout?.toString(),
      stderr: error.stderr?.toString()
    }, { status: 500 });
  }
}
