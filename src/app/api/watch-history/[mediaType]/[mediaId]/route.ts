import { NextRequest, NextResponse } from 'next/server';
import { getWatchProgress } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaType: string; mediaId: string }> }
) {
  try {
    const { mediaType, mediaId } = await params;
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season');
    const episode = searchParams.get('episode');
    
    if (mediaType !== 'movie' && mediaType !== 'tv') {
      return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
    }
    
    const progress = getWatchProgress(
      mediaType as 'movie' | 'tv',
      parseInt(mediaId),
      season ? parseInt(season) : undefined,
      episode ? parseInt(episode) : undefined
    );
    
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching watch progress:', error);
    return NextResponse.json({ error: 'Failed to fetch watch progress' }, { status: 500 });
  }
}
