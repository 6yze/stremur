import { NextRequest, NextResponse } from 'next/server';
import { getWatchlist, addToWatchlist } from '@/lib/db';

export async function GET() {
  try {
    const watchlist = getWatchlist();
    return NextResponse.json(watchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaType, mediaId, title, posterPath } = body;
    
    if (!mediaType || !mediaId || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    addToWatchlist({
      media_type: mediaType,
      media_id: mediaId,
      title,
      poster_path: posterPath
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 });
  }
}
