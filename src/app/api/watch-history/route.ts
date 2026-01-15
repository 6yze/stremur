import { NextRequest, NextResponse } from 'next/server';
import { getWatchHistory, updateWatchProgress } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const history = getWatchHistory(limit ? parseInt(limit) : undefined);
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching watch history:', error);
    return NextResponse.json({ error: 'Failed to fetch watch history' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaType, mediaId, season, episode, progress, duration, title, posterPath } = body;
    
    if (!mediaType || !mediaId || progress === undefined || !duration || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    updateWatchProgress({
      media_type: mediaType,
      media_id: mediaId,
      season,
      episode,
      progress,
      duration,
      title,
      poster_path: posterPath
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating watch progress:', error);
    return NextResponse.json({ error: 'Failed to update watch progress' }, { status: 500 });
  }
}
