import { NextRequest, NextResponse } from 'next/server';
import { registerClick } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, url } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: 'Platform and URL are required' },
        { status: 400 }
      );
    }

    // Create a simple hash of IP for uniqueness (not storing raw IP)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0] || request.ip || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);

    // Register the click
    const clickId = registerClick({
      platform,
      url,
      userAgent: request.headers.get('user-agent') || '',
      ipHash,
      referrer: request.headers.get('referer') || ''
    });

    return NextResponse.json({
      success: true,
      clickId,
      message: 'Click tracked successfully'
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track click', success: false },
      { status: 500 }
    );
  }
}

// CORS headers for preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
