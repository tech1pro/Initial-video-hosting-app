export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration: string;
  channel?: string;
  views?: string;
  url?: string;
}

export const videos: Video[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    description: "Learn the basics of Next.js and the App Router.",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop",
    duration: "12:34",
    channel: "Video Hosting",
    views: "12.5k",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "2",
    title: "Building with Tailwind CSS",
    description: "Style your app quickly with Tailwind.",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
    duration: "8:21",
    channel: "Video Hosting",
    views: "8.2k",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "3",
    title: "TypeScript in 2024",
    description: "Type-safe JavaScript for better DX.",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop",
    duration: "15:00",
    channel: "Video Hosting",
    views: "22.1k",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "4",
    title: "React Server Components",
    description: "Understanding RSC and the new mental model.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
    duration: "18:45",
    channel: "Video Hosting",
    views: "5.3k",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "5",
    title: "Deploying to Vercel",
    description: "Ship your Next.js app in minutes.",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop",
    duration: "6:12",
    channel: "Video Hosting",
    views: "9.7k",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: "6",
    title: "API Routes & Data Fetching",
    description: "Backend and data in Next.js.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop",
    duration: "14:30",
    channel: "Video Hosting",
    views: "11.2k",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
];
