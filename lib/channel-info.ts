/**
 * Public channel profile (mirrors YouTube “About” / og:description).
 * Update here if the channel rebrands; optional: extend RSS seed script later.
 */
export const CHANNEL_INFO = {
  displayName: "Hip Hop Imagination",
  handle: "hiphopimagination",
  youtubeUrl: "https://www.youtube.com/@hiphopimagination",
  /** Channel avatar (square, from YouTube CDN) */
  avatarUrl:
    "https://yt3.googleusercontent.com/6HHWA8D9KyYlS2_bAd-ZTij9IrsAIC64JLGF1_Q1hjhjeXL5Gl5F_lvvTciWQ2BBOptrRCa1vQ=s176-c-k-c0x00ffffff-no-rj",
  /** Main blurb from the channel description */
  intro:
    "Welcome to Hip Hop Imagination — where culture, creativity, and AI collide.",
  /** Hashtag line from the channel (shown as chips, no # in strings) */
  topics: [
    "hiphopcommunity",
    "fyp",
    "hiphop",
    "memes",
    "shorts",
    "ai",
    "imagination",
    "rap",
    "culture",
    "nostalgia",
    "parody",
  ],
} as const;
