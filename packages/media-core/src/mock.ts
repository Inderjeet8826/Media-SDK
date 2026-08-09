import { Photo, Video, PaginatedResponse } from './types';

const SAMPLE_PHOTO_SUBJECTS = [
  'Architectural symmetry and minimalist glass facade in modern downtown',
  'Sunlight filtering through vibrant emerald canopy in deep rainforest',
  'Serene turquoise waves crashing gently against black volcanic cliffs at golden hour',
  'Cozy warm interior coffee roastery with steam rising and vintage grinders',
  'Dramatic snowcapped alpine peaks reflected in calm crystal-clear glacier lake',
  'Vibrant neon street nightscape with light trails in downtown Tokyo',
  'Macro shot of delicate morning dew drops on a vivid scarlet rose petal',
  'Golden autumn forest path blanketed with amber and bronze maple leaves',
  'Minimalist sand dunes under star-filled night sky and Milky Way galaxy',
  'Modern ceramic pottery artist crafting clay bowl on traditional spinning wheel',
  'Aesthetic workspace with mechanical keyboard, espresso cup, and indoor monstera',
  'Majestic lone lighthouse standing steadfast against stormy ocean breakers',
];

const SAMPLE_PHOTOGRAPHERS = [
  { name: 'Elena Rostova', url: 'https://images.pexels.com/users/elena-rostova', id: 101 },
  { name: 'Marcus Vance', url: 'https://images.pexels.com/users/marcus-vance', id: 102 },
  { name: 'Aria Takahashi', url: 'https://images.pexels.com/users/aria-takahashi', id: 103 },
  { name: 'Liam Gallagher', url: 'https://images.pexels.com/users/liam-gallagher', id: 104 },
  { name: 'Sophia Chen', url: 'https://images.pexels.com/users/sophia-chen', id: 105 },
];

const SAMPLE_VIDEOS = [
  {
    title: 'Cinematic Ocean Waves Slow Motion',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fallbackUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    duration: 15,
  },
  {
    title: 'Big Buck Bunny Animation HD',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80',
    duration: 15,
  },
  {
    title: 'Nature Bloom Timelapse',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80',
    duration: 15,
  },
  {
    title: 'Elephants Dream Open Movie',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
    duration: 15,
  },
  {
    title: 'For Bigger Escapes Cinematic Reel',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    fallbackUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    duration: 15,
  },
];

export function generateMockPhotos(page: number = 1, perPage: number = 15, query?: string): PaginatedResponse<Photo> {
  const totalResults = 120;
  const startIndex = (page - 1) * perPage;
  const items: Photo[] = [];

  for (let i = 0; i < perPage && startIndex + i < totalResults; i++) {
    const globalIndex = startIndex + i;
    const id = 100000 + globalIndex;
    const subjectIndex = globalIndex % SAMPLE_PHOTO_SUBJECTS.length;
    const photographer = SAMPLE_PHOTOGRAPHERS[globalIndex % SAMPLE_PHOTOGRAPHERS.length];
    const baseUnsplashId = [
      '1506744038136-46273834b3fb',
      '1511497584788-87676104235f',
      '1507525428034-b723cf961d3e',
      '1470071459604-3b5ec3a7fe05',
      '1472214103451-9374bd1c798e',
      '1464822759023-fed622ff2c3b',
      '1518770660439-4636190af475',
      '1501785888041-af3ef285b470',
      '1534447677768-be436bb09401',
      '1469474968028-56623f02e42e',
      '1498050108023-c5249f4df085',
      '1426604966848-d7adac402bff',
    ][globalIndex % 12];

    const imgBase = `https://images.unsplash.com/photo-${baseUnsplashId}`;
    const altText = query
      ? `${query.charAt(0).toUpperCase() + query.slice(1)}: ${SAMPLE_PHOTO_SUBJECTS[subjectIndex]}`
      : SAMPLE_PHOTO_SUBJECTS[subjectIndex];

    items.push({
      id,
      width: 4000,
      height: 2667,
      url: `https://www.pexels.com/photo/${id}/`,
      photographer: photographer.name,
      photographer_url: photographer.url,
      photographer_id: photographer.id,
      avg_color: ['#2C3E50', '#1A365D', '#2E4053', '#1B4F72', '#145A32', '#641E16'][globalIndex % 6],
      liked: false,
      alt: altText,
      type: 'photo',
      src: {
        original: `${imgBase}?auto=format&fit=crop&w=3000&q=90`,
        large2x: `${imgBase}?auto=format&fit=crop&w=1800&q=85`,
        large: `${imgBase}?auto=format&fit=crop&w=1000&q=80`,
        medium: `${imgBase}?auto=format&fit=crop&w=600&q=80`,
        small: `${imgBase}?auto=format&fit=crop&w=300&q=75`,
        portrait: `${imgBase}?auto=format&fit=crop&w=800&h=1200&q=80`,
        landscape: `${imgBase}?auto=format&fit=crop&w=1200&h=800&q=80`,
        tiny: `${imgBase}?auto=format&fit=crop&w=200&q=60`,
      },
    });
  }

  return {
    page,
    per_page: perPage,
    total_results: totalResults,
    next_page: startIndex + perPage < totalResults ? `page=${page + 1}&per_page=${perPage}` : undefined,
    prev_page: page > 1 ? `page=${page - 1}&per_page=${perPage}` : undefined,
    items,
  };
}

export function generateMockVideos(page: number = 1, perPage: number = 10, query?: string): PaginatedResponse<Video> {
  const totalResults = 50;
  const startIndex = (page - 1) * perPage;
  const items: Video[] = [];

  for (let i = 0; i < perPage && startIndex + i < totalResults; i++) {
    const globalIndex = startIndex + i;
    const sample = SAMPLE_VIDEOS[globalIndex % SAMPLE_VIDEOS.length];
    const id = 200000 + globalIndex;
    const photographer = SAMPLE_PHOTOGRAPHERS[globalIndex % SAMPLE_PHOTOGRAPHERS.length];

    items.push({
      id,
      width: 1920,
      height: 1080,
      url: `https://www.pexels.com/video/${id}/`,
      image: sample.poster,
      duration: sample.duration,
      alt: query ? `${query} video: ${sample.title}` : sample.title,
      type: 'video',
      user: {
        id: photographer.id,
        name: photographer.name,
        url: photographer.url,
      },
      video_files: [
        {
          id: id * 10 + 1,
          quality: 'hd',
          file_type: 'video/mp4',
          width: 1920,
          height: 1080,
          fps: 30,
          link: sample.videoUrl,
        },
        {
          id: id * 10 + 2,
          quality: 'sd',
          file_type: 'video/mp4',
          width: 1280,
          height: 720,
          fps: 30,
          link: sample.fallbackUrl || sample.videoUrl,
        },
      ],
      video_pictures: [
        {
          id: id * 100 + 1,
          nr: 0,
          picture: sample.poster,
        },
      ],
    });
  }

  return {
    page,
    per_page: perPage,
    total_results: totalResults,
    next_page: startIndex + perPage < totalResults ? `page=${page + 1}&per_page=${perPage}` : undefined,
    prev_page: page > 1 ? `page=${page - 1}&per_page=${perPage}` : undefined,
    items,
  };
}
