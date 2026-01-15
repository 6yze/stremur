import { tmdb } from './tmdb';

async function testTMDB() {
  console.log('Testing TMDB Client...');
  
  try {
    console.log('Fetching trending all/day...');
    const trending = await tmdb.getTrending('all', 'day');
    
    if (trending.results && trending.results.length > 0) {
      const firstItem = trending.results[0];
      const title = firstItem.title || firstItem.name || 'Unknown Title';
      console.log(`Success! First trending item: ${title} (ID: ${firstItem.id}, Type: ${firstItem.media_type})`);
    } else {
      console.log('Success, but no results returned.');
    }
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testTMDB();
