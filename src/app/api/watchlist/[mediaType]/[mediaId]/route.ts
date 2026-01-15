import { NextRequest, NextResponse } from 'next/server';
import { isInWatchlist, removeFromWatchlist } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaType: string; mediaId: string }> }
) {
  try {
    const { mediaType, mediaId } = await params;
    
    if (mediaType !== 'movie' && mediaType !== 'tv') {
      return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
    }
    
    const inWatchlist = isInWatchlist(mediaType as 'movie' | 'tv', parseInt(mediaId));
    return NextResponse.json({ inWatchlist });
  } catch (error) {
    console.error('Error checking watchlist status:', error);
    return NextResponse.json({ error: 'Failed to check watchlist status' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ mediaType: string; mediaId: string }> }
) {
  try {
    const { mediaType, mediaId } = await params;
    
    if (mediaType !== 'movie' && mediaType !== 'tv') {
      return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
    }
    
    removeFromWatchlist(mediaType as 'movie' | 'tv', parseInt(mediaId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 });
  }
}
