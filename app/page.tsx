import VideoHomeClient from "@/components/VideoHomeClient";
import { getDisplayVideos } from "@/lib/video-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const videos = await getDisplayVideos();
  return <VideoHomeClient videos={videos} />;
}
