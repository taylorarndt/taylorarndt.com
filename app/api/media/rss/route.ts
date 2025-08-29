import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

interface RSSItem {
  id: string
  title: string
  url: string
  summary: string
  date: string
  image?: string
  source: 'youtube' | 'substack'
  type: string
  duration?: string
  platform: string
  featured: boolean
}

const parser = new Parser({
  customFields: {
    item: [
      ['media:thumbnail', 'thumbnail'],
      ['media:group', 'mediaGroup'],
      ['yt:videoId', 'videoId'],
      ['description', 'description']
    ]
  }
})

// RSS Feed URLs
const RSS_FEEDS = {
  youtube: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7J5I0muqqQF51axXfPwrgA',
  substack: 'https://taylorarndt.substack.com/feed'
}

async function fetchRSSFeed(url: string, source: 'youtube' | 'substack'): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(url)
    const items: RSSItem[] = []

    for (const item of feed.items) {
      let image = ''
      let type = ''
      let platform = ''

      if (source === 'youtube') {
        // Extract YouTube thumbnail
        const videoId = (item as any).videoId || ''
        if (videoId) {
          image = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        } else if ((item as any).thumbnail && (item as any).thumbnail.$?.url) {
          image = (item as any).thumbnail.$.url
        }
        type = 'Video'
        platform = 'YouTube'
      } else if (source === 'substack') {
        // Extract Substack image from description or use default
        const description = item.content || item.description || ''
        const imgMatch = description.match(/<img[^>]+src="([^"]+)"/)
        if (imgMatch) {
          image = imgMatch[1]
        }
        type = 'Article'
        platform = 'Substack'
      }

      const rssItem: RSSItem = {
        id: `${source}-${item.guid || item.link || Math.random()}`,
        title: item.title || 'Untitled',
        url: item.link || '#',
        summary: item.contentSnippet || item.description || 'No description available',
        date: item.pubDate || item.isoDate || new Date().toISOString(),
        image,
        source,
        type,
        platform,
        featured: false
      }

      items.push(rssItem)
    }

    return items
  } catch (error) {
    console.error(`Error fetching ${source} RSS feed:`, error)
    return []
  }
}

// Fallback sample data for development/offline scenarios
const sampleRSSItems: RSSItem[] = [
  {
    id: 'youtube-sample-1',
    title: 'Building Scalable React Applications',
    url: 'https://youtube.com/watch?v=sample1',
    summary: 'Learn how to build scalable React applications with modern patterns and best practices.',
    date: '2024-01-20T10:00:00Z',
    image: 'https://img.youtube.com/vi/sample1/maxresdefault.jpg',
    source: 'youtube',
    type: 'Video',
    platform: 'YouTube',
    featured: true
  },
  {
    id: 'substack-sample-1',
    title: 'The Future of Web Development',
    url: 'https://taylorarndt.substack.com/p/future-web-dev',
    summary: 'Exploring emerging trends and technologies shaping the future of web development.',
    date: '2024-01-18T15:30:00Z',
    image: 'https://substackcdn.com/image/fetch/w_1200,h_600,c_fill,f_jpg,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fsample.jpg',
    source: 'substack',
    type: 'Article',
    platform: 'Substack',
    featured: true
  },
  {
    id: 'youtube-sample-2',
    title: 'TypeScript Best Practices',
    url: 'https://youtube.com/watch?v=sample2',
    summary: 'Deep dive into TypeScript best practices for modern development.',
    date: '2024-01-15T09:00:00Z',
    image: 'https://img.youtube.com/vi/sample2/maxresdefault.jpg',
    source: 'youtube',
    type: 'Video',
    platform: 'YouTube',
    featured: false
  },
  {
    id: 'substack-sample-2',
    title: 'Leadership in Tech Teams',
    url: 'https://taylorarndt.substack.com/p/leadership-tech',
    summary: 'Insights on effective leadership strategies for technology teams.',
    date: '2024-01-12T12:00:00Z',
    source: 'substack',
    type: 'Article',
    platform: 'Substack',
    featured: false
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    let allItems: RSSItem[] = []

    try {
      // Attempt to fetch both RSS feeds in parallel
      const [youtubeItems, substackItems] = await Promise.all([
        fetchRSSFeed(RSS_FEEDS.youtube, 'youtube'),
        fetchRSSFeed(RSS_FEEDS.substack, 'substack')
      ])

      allItems = [...youtubeItems, ...substackItems]
    } catch (fetchError) {
      console.log('Failed to fetch RSS feeds, using sample data for development')
      allItems = sampleRSSItems
    }

    // If no items were fetched (e.g., network issues), use sample data
    if (allItems.length === 0) {
      console.log('No RSS items fetched, using sample data')
      allItems = sampleRSSItems
    }

    // Sort by date and limit
    const sortedItems = allItems
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)

    // Mark the most recent 2 items as featured if not already set
    const featuredCount = sortedItems.filter(item => item.featured).length
    if (featuredCount === 0 && sortedItems.length > 0) {
      sortedItems[0].featured = true
      if (sortedItems.length > 1) {
        sortedItems[1].featured = true
      }
    }

    return NextResponse.json({
      items: sortedItems,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in RSS API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSS feeds' },
      { status: 500 }
    )
  }
}