import type { Video } from "@/lib/types";
import { isYouTubeVideo } from "@/lib/video-utils";

export default function VideoPlayer({ video }: { video: Video }) {
  if (isYouTubeVideo(video)) {
    return (
      <iframe
        title={video.title}
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${video.id}?rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      className="absolute inset-0 h-full w-full object-contain"
      src={video.url}
      controls
      playsInline
      poster={video.thumbnail}
    />
  );
}
