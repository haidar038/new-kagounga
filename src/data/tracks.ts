import type { Distributor, Track } from "../types/content";
import { cld } from "../lib/cloudinary";

export const ARTIST_PLAYER_SRC =
  "https://open.spotify.com/embed/artist/4TSp3l3tAtUr04jdHkqsNO?utm_source=generator&theme=0";

export const SPOTIFY_FOLLOW_URL =
  "https://open.spotify.com/artist/4TSp3l3tAtUr04jdHkqsNO?si=JIfK6h3GTJ-5s14oZiV0iw";

const COVER = cld("brand-music.webp", 600);

export const TRACKS: Track[] = [
  {
    title: "Walking Shark",
    artist: "Kagōunga",
    meta: "Kagounga • 2025",
    cover: COVER,
    coverAlt: "Walking Shark cover",
    links: [
      {
        label: "Spotify",
        href: "https://open.spotify.com/track/2W7mqRXUmpJLnWPdIUUwh8?si=d5624230cd1d4843",
        brand: "spotify",
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/id/album/walking-shark-single/1830258778?l=id",
        brand: "apple",
      },
      {
        label: "YouTube Music",
        href: "https://youtu.be/t02jxzSR4UA?si=RPEs-TXPqSVNjOLT",
        brand: "youtube",
      },
      {
        label: "Amazon Music",
        href: "https://amazon.com/music/player/albums/B0FKHD8DFB?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_hmJWfS5XRkvK0q1WIXYeDVn0H",
        brand: "amazon",
      },
    ],
    playerSrc:
      "https://open.spotify.com/embed/track/2W7mqRXUmpJLnWPdIUUwh8?utm_source=generator&theme=0",
  },
  {
    title: "Popeda VOC",
    artist: "Kagōunga",
    meta: "Kagounga • 2025",
    cover: COVER,
    coverAlt: "Popeda VOC cover",
    links: [
      {
        label: "Spotify",
        href: "https://open.spotify.com/track/32uoH2Y36bClKW1jMdjEAZ?si=2532f323b15147a0",
        brand: "spotify",
      },
    ],
    playerSrc:
      "https://open.spotify.com/embed/track/32uoH2Y36bClKW1jMdjEAZ?utm_source=generator&theme=0",
  },
  {
    title: "Suba Jou",
    artist: "Kagōunga",
    meta: "Kagounga • 2025",
    cover: COVER,
    coverAlt: "Suba Jou cover",
    links: [
      {
        label: "Spotify",
        href: "https://open.spotify.com/track/6T3SQm9KUADeUm04nMrBqA?si=1330110da27b40d6",
        brand: "spotify",
      },
    ],
    playerSrc:
      "https://open.spotify.com/embed/track/6T3SQm9KUADeUm04nMrBqA?utm_source=generator&theme=0",
  },
];

export const DISTRIBUTORS: Distributor[] = [
  { name: "Spotify", logo: cld("Spotify.webp", 320) },
  { name: "Apple Music", logo: cld("apple-music.webp", 320) },
  { name: "Deezer", logo: cld("DEEZER.webp", 320) },
  { name: "YouTube Music", logo: cld("YouTube-Music.webp", 320) },
  { name: "TikTok", logo: cld("TikTok.webp", 320) },
  { name: "Shazam", logo: cld("Shazam.webp", 320) },
  { name: "Amazon Music", logo: cld("Amazon-Music.webp", 320) },
  { name: "Joox", logo: cld("JOOX.webp", 320) },
  { name: "Tidal", logo: cld("Tidal.webp", 320) },
  { name: "iHeartRadio", logo: cld("IHeartRadio.webp", 320) },
  { name: "Meta Music", logo: cld("Meta-Musics.webp", 320) },
  { name: "Soundcloud", logo: cld("Soundcloud.webp", 320) },
  { name: "7digital", logo: cld("7digital.webp", 320) },
  { name: "Tencent Music", logo: cld("Tencent-Music.webp", 320) },
  { name: "Line Music", logo: cld("Line-Music.webp", 320) },
  { name: "Pandora", logo: cld("Pandora.webp", 320) },
];
