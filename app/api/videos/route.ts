import { NextResponse } from "next/server";
import { getDisplayVideos } from "@/lib/video-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const videos = await getDisplayVideos();
  return NextResponse.json({ videos });
}
