import type { Distributor, Track } from "../types/content";

export const ARTIST_PLAYER_SRC =
  "https://open.spotify.com/embed/artist/4TSp3l3tAtUr04jdHkqsNO?utm_source=generator&theme=0";

export const SPOTIFY_FOLLOW_URL =
  "https://open.spotify.com/artist/4TSp3l3tAtUr04jdHkqsNO?si=JIfK6h3GTJ-5s14oZiV0iw";

const COVER = "https://i.ibb.co.com/qF0DnCjm/Kagounga-Artist.jpg";

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
      {
        label: "Deezer",
        href: "https://www.deezer.com/track/1234567890",
        brand: "deezer",
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
  { name: "Spotify", logo: "/img/music/Spotify.webp" },
  { name: "Apple Music", logo: "/img/music/apple-music.webp" },
  { name: "Deezer", logo: "/img/music/DEEZER.webp" },
  { name: "YouTube Music", logo: "/img/music/YouTube-Music.webp" },
  { name: "TikTok", logo: "/img/music/TikTok.webp" },
  { name: "Shazam", logo: "/img/music/Shazam.webp" },
  { name: "Amazon Music", logo: "/img/music/Amazon-Music.webp" },
  { name: "Joox", logo: "/img/music/JOOX.webp" },
  { name: "Tidal", logo: "/img/music/Tidal.webp" },
  { name: "iHeartRadio", logo: "/img/music/IHeartRadio.webp" },
  { name: "Meta Music", logo: "/img/music/Meta-Musics.webp" },
  { name: "Soundcloud", logo: "/img/music/Soundcloud.webp" },
  { name: "7digital", logo: "/img/music/7digital.webp" },
  { name: "Tencent Music", logo: "/img/music/Tencent-Music.webp" },
  { name: "Line Music", logo: "/img/music/Line-Music.webp" },
  { name: "Pandora", logo: "/img/music/Pandora.webp" },
];
