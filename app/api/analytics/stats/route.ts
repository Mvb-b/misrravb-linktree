import { NextResponse } from 'next/server';
import { getAllStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = getAllStats();

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        success: false,
        data: null
      },
      { status: 500 }
    );
  }
}

// Cache for 60 seconds
export const revalidate = 60;
