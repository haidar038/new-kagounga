/**
 * Artwork collection - single source of truth for the /artworks page.
 *
 * Captions are converted from the translated JSON files in the staging area
 * (repo root ../images/json/): Markdown emphasis is pre-parsed into styled
 * runs so nothing parses markup at runtime. A run with bold maps to
 * `**…**`, italic to `*…*`, both to `***…***`; an empty line array is a
 * stanza break. Do not merge the two "Gamalama" entries - they are distinct
 * artworks with distinct captions.
 *
 * Artwork sources live on Cloudinary (cloud `fal5otmd`, display folder
 * "Artworks") and are stored rotated 90° counter-clockwise at 1063×650;
 * delivery URLs rotate them upright with the `a_90` transformation (see
 * ArtworkCard).
 */

export interface ArtworkCaptionRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export interface Artwork {
  slug: string;
  title: string;
  /** Cloudinary public ID, versionless, with extension. */
  publicId: string;
  alt: { en: string; id: string };
  caption: { en: ArtworkCaptionRun[][]; id: ArtworkCaptionRun[][] };
}

/** Brand marks shown on the caption card, keyed by the source JSON slots. */
export type ArtworkLogoId =
  | "ea_sketch"
  | "ea_sketch_kanan"
  | "hexagon_merah"
  | "ō_monogram";

/**
 * Cloudinary assets for each brand mark (cloud `fal5otmd`). `ea_sketch` and
 * `ea_sketch_kanan` are the same asset - the source design only differs in
 * slot placement. Width/height describe the delivered 96px-wide image ratio.
 */
export const ARTWORK_LOGO_ASSETS: Record<
  ArtworkLogoId,
  { publicId: string; width: number; height: number }
> = {
  ea_sketch: { publicId: "sketch_e_logo_2.webp", width: 96, height: 135 },
  ea_sketch_kanan: { publicId: "sketch_e_logo_2.webp", width: 96, height: 135 },
  hexagon_merah: { publicId: "nukila_dive_logo.webp", width: 96, height: 110 },
  "ō_monogram": { publicId: "logogram_dark_logo.webp", width: 96, height: 83 },
};

/** Byline for caption cards bearing the sketch-ea mark (from the artwork signatures). */
export const SKETCH_EA_CREDIT = "Fadrié (Sketch EA)";

/** logo_left / logo_right slots per artwork, from the source JSONs. */
export const ARTWORK_LOGOS: Record<
  string,
  { left: ArtworkLogoId[]; right: ArtworkLogoId[] }
> = {
  "tiba-di-rumah": { left: ["ea_sketch"], right: ["ō_monogram"] },
  "perjalanan-jauh": { left: ["ea_sketch"], right: ["ō_monogram"] },
  "panggayung-hasa-hasa": { left: ["ea_sketch"], right: ["ō_monogram"] },
  "gate-sonyinga-1": { left: ["ea_sketch"], right: ["ō_monogram"] },
  "gate-sonyinga-2": { left: ["ea_sketch"], right: ["ō_monogram"] },
  "walking-shark-advance": {
    left: ["hexagon_merah"],
    right: ["ea_sketch_kanan", "ō_monogram"],
  },
  "walking-shark-master": {
    left: ["hexagon_merah"],
    right: ["ea_sketch_kanan", "ō_monogram"],
  },
  "walking-shark-divemaster": {
    left: ["hexagon_merah"],
    right: ["ea_sketch_kanan", "ō_monogram"],
  },
  "pohon-sagu": { left: [], right: ["ō_monogram"] },
  "gamalama-1": { left: [], right: ["ō_monogram"] },
  "gunung-gamalama": { left: [], right: ["ō_monogram"] },
  "gunung-dukono": { left: [], right: ["ō_monogram"] },
  "gunung-gamkonora": { left: [], right: ["ō_monogram"] },
  kalamata: { left: [], right: ["ō_monogram"] },
};

export const artworks: Artwork[] = [
  {
    slug: "tiba-di-rumah",
    title: "Tiba di Rumah",
    publicId: "Tiba_di_Rumah.webp",
    alt: {
      en: "Monochrome illustration of a boat hull resting between palm trees by the shore",
      id: "Ilustrasi monokrom lambung perahu di antara pohon palem di tepi pantai",
    },
    caption: {
      id: [
        [
          { text: "Berlayar", bold: true },
          { text: " saja," },
        ],

        [
          { text: "susuri laut panjang dengan " },
          { text: "tapakmu", bold: true },
          { text: "." },
        ],

        [
          { text: "Setelah " },
          { text: "tujuh senja", bold: true },
          { text: " melalui malam," },
        ],

        [
          { text: "baru kita tahu " },
          { text: "rindu", bold: true },
          { text: " bukanlah canda." },
        ],
      ],
      en: [
        [
          { text: "Sail on,", bold: true, italic: true },
        ],

        [
          { text: "trace the long sea with your ", italic: true },
          { text: "steps.", bold: true, italic: true },
        ],

        [
          { text: "After ", italic: true },
          { text: "seven dusks ", bold: true, italic: true },
          { text: "have passed through the night,", italic: true },
        ],

        [
          { text: "only then we know ", italic: true },
          { text: "longing ", bold: true, italic: true },
          { text: "is no jest.", italic: true },
        ],
      ],
    },
  },
  {
    slug: "perjalanan-jauh",
    title: "Perjalanan Jauh Telah Usai",
    publicId: "Perjalanan_Jauh.webp",
    alt: {
      en: "Illustration of two figures embracing among green leaves",
      id: "Ilustrasi dua sosok berpeluk di antara dedaunan hijau",
    },
    caption: {
      id: [
        [
          { text: "Mengepak nasib pada " },
          { text: "angin", bold: true },
          { text: " dan " },
          { text: "bintang", bold: true },
          { text: "," },
        ],

        [
          { text: "rasa " },
          { text: "tanya", bold: true },
          { text: " itu hanya terlihat" },
        ],

        [
          { text: "jika " },
          { text: "kau", bold: true },
          { text: " mengadu" },
        ],

        [
          { text: "pada " },
          { text: "semesta", bold: true },
          { text: "." },
        ],
      ],
      en: [
        [
          { text: "Packing fate upon the ", italic: true },
          { text: "wind ", bold: true, italic: true },
          { text: "and ", italic: true },
          { text: "stars,", bold: true, italic: true },
        ],

        [
          { text: "the ", italic: true },
          { text: "question ", bold: true, italic: true },
          { text: "within reveals itself", italic: true },
        ],

        [
          { text: "only when ", italic: true },
          { text: "you ", bold: true, italic: true },
          { text: "confide", italic: true },
        ],

        [
          { text: "in the ", italic: true },
          { text: "universe.", bold: true, italic: true },
        ],
      ],
    },
  },
  {
    slug: "panggayung-hasa-hasa",
    title: "Panggayung Hasa-Hasa",
    publicId: "Panggayung_Hasa-Hasa.webp",
    alt: {
      en: "Illustration of two fish circling an outrigger canoe under palm fronds",
      id: "Ilustrasi dua ikan mengitari perahu katir di bawah pelepah palem",
    },
    caption: {
      id: [
        [
          { text: "Musafir", bold: true },
          { text: " pulang menyusuri rasa." },
        ],

        [
          { text: "Di bagian " },
          { text: "tumitnya", bold: true },
          { text: "," },
        ],

        [
          { text: "asa " },
          { text: "menjelma", bold: true },
          { text: " nestapa." },
        ],
        [],

        [
          { text: "Mari kita " },
          { text: "pulang!", bold: true },
        ],
      ],
      en: [
        [
          { text: "The wanderer ", bold: true, italic: true },
          { text: "returns, tracing the path of longing.", italic: true },
        ],

        [
          { text: "At the ", italic: true },
          { text: "heel ", bold: true, italic: true },
          { text: "of his journey,", italic: true },
        ],

        [
          { text: "hope ", italic: true },
          { text: "turns ", bold: true, italic: true },
          { text: "into sorrow.", italic: true },
        ],
        [],

        [
          { text: "Come, let us ", italic: true },
          { text: "return!", bold: true, italic: true },
        ],
      ],
    },
  },
  {
    slug: "gate-sonyinga-1",
    title: "Gate Sonyinga #1",
    publicId: "Gate_Sonyinga_1.webp",
    alt: {
      en: "Illustration of two people face to face with a sago palm rising between them",
      id: "Ilustrasi dua orang berhadapan dengan pohon sagu tumbuh di antara mereka",
    },
    caption: {
      id: [
        [
          { text: "Mengapa takut", bold: true },
          { text: " melempar tangkai pada batu?" },
        ],

        [
          { text: "Meski tak laju " },
          { text: "mekar", bold: true },
          { text: "," },
        ],

        [
          { text: "rindu bisa " },
          { text: "kau", bold: true },
          { text: " pahami saja." },
        ],
        [],

        [
          { text: "Iya, kau " },
          { text: "saja", bold: true },
          { text: "." },
        ],
      ],
      en: [
        [
          { text: "Why fear", bold: true, italic: true },
          { text: " casting a stalk upon the stone?" },
        ],

        [
          { text: "Though it may not ", italic: true },
          { text: "bloom ", bold: true },
          { text: "in haste,", italic: true },
        ],

        [
          { text: "longing is something ", italic: true },
          { text: "you ", bold: true, italic: true },
          { text: "can simply understand.", italic: true },
        ],
        [],

        [
          { text: "Yes, you ", italic: true },
          { text: "alone.", bold: true, italic: true },
        ],
      ],
    },
  },
  {
    slug: "gate-sonyinga-2",
    title: "Gate Sonyinga #2",
    publicId: "Gate_Sonyinga_2.webp",
    alt: {
      en: "Illustration of a couple holding woven plates before a traditional boat prow",
      id: "Ilustrasi sepasang pengantin membawa peling anyaman di hadapan sosok perahu",
    },
    caption: {
      id: [
        [
          { text: "Genggaman", bold: true },
          { text: " itu punya rahasia." },
        ],

        [
          { text: "Namun, ia lupa " },
          { text: "mengurai", bold: true },
          { text: " cerita." },
        ],

        [
          { text: "Barangkali, mungkin setelah " },
          { text: "hujan", bold: true },
          { text: " reda," },
        ],

        [
          { text: "dan malam " },
          { text: "terjamak", bold: true },
          { text: " pekat." },
        ],
      ],
      en: [
        [
          { text: "The ", italic: true },
          { text: "clasp ", bold: true, italic: true },
          { text: "holds a secret.", italic: true },
        ],

        [
          { text: "Yet it forgets to ", italic: true },
          { text: "unravel ", bold: true, italic: true },
          { text: "the tale.", italic: true },
        ],

        [
          { text: "Perhaps, when the ", italic: true },
          { text: "rain ", bold: true, italic: true },
          { text: "has eased,", italic: true },
        ],

        [
          { text: "and the night ", italic: true },
          { text: "deepens ", bold: true, italic: true },
          { text: "into darkness.", italic: true },
        ],
      ],
    },
  },
  {
    slug: "walking-shark-advance",
    title: "Walking Shark | Advance",
    publicId: "Shark_1.webp",
    alt: {
      en: "Illustration of a smiling walking shark in blue sneakers crawling on the sea floor",
      id: "Ilustrasi walking shark tersenyum bersepatu biru merayap di dasar laut",
    },
    caption: {
      id: [
        [
          { text: "Walking shark", bold: true },
          { text: " atau hiu berjalan (Hemiscyllium halmahera) adalah spesies hiu unik yang merupakan endemik di perairan Maluku Utara, khususnya di sekitar Pulau Halmahera, Pulau Ternate, dan Pulau Tidore. Ia dikenal karena cara berjalannya yang khas, yakni menggunakan sirip dada dan panggul untuk merayap di dasar laut, seolah-olah sedang berjalan. Panjangnya berkisar antara 68 cm hingga 1,2 meter, berwarna cokelat muda dengan bintik-bintik berbentuk poligon di seluruh tubuh." },
        ],
      ],
      en: [
        [
          { text: "The ", italic: true },
          { text: "walking shark ", bold: true, italic: true },
          { text: "(Hemiscyllium halmahera) is a unique species of shark that is endemic to the waters of", italic: true },
          { text: " North Maluku" },
          { text: ", particularly around Halmahera Island, Ternate Island, and Tidore Island. It is known for its distinctive way of moving, using its pectoral and pelvic fins to crawl along the sea floor, as if it were walking. Its length ranges from about", italic: true },
          { text: " 68 cm " },
          { text: "to", italic: true },
          { text: " 1.2 " },
          { text: "meters, and it has a light brown body with dark polygon-shaped spots scattered across its skin.", italic: true },
        ],
      ],
    },
  },
  {
    slug: "walking-shark-master",
    title: "Walking Shark | Master",
    publicId: "Shark_2.webp",
    alt: {
      en: "Illustration of a walking shark standing upright in blue sneakers looking skyward",
      id: "Ilustrasi walking shark berdiri tegak bersepatu biru menengadah",
    },
    caption: {
      id: [
        [
          { text: "Hiu ini pertama kali ditemukan oleh ilmuwan Australia, " },
          { text: "Gerry Allen", bold: true },
          { text: ", pada tahun 2008 di Teluk Buli, Halmahera, dan dinyatakan sebagai spesies endemik pada " },
          { text: "2012", bold: true },
          { text: ". Karena persebarannya yang sangat terbatas dan pertumbuhannya yang lambat, " },
          { text: "Hemiscyllium halmahera", bold: true },
          { text: " masuk dalam kategori hampir terancam (Near Threatened) menurut IUCN. Perilakunya nokturnal, lebih aktif di malam hari untuk mencari makan seperti udang, kepingting, dan ikan kecil." },
        ],
      ],
      en: [
        [
          { text: "This shark was", italic: true },
          { text: " first discovered " },
          { text: "by", italic: true },
          { text: " Australian " },
          { text: "scientist ", italic: true },
          { text: "Gerry Allen ", bold: true, italic: true },
          { text: "in", italic: true },
          { text: " 2008 " },
          { text: "in", italic: true },
          { text: " Buli Bay, Halmahera, " },
          { text: "and", italic: true },
          { text: " was officially recognized " },
          { text: "as an endemic species in ", italic: true },
          { text: "2012.", bold: true, italic: true },
        ],

        [
          { text: "Due to its very limited distribution and slow growth, ", italic: true },
          { text: "Hemiscyllium halmahera ", bold: true, italic: true },
          { text: "is classified as", italic: true },
          { text: " Near Threatened " },
          { text: "by the", italic: true },
          { text: " IUCN." },
        ],

        [
          { text: "It is", italic: true },
          { text: " nocturnal " },
          { text: "in behavior,", italic: true },
          { text: " becoming more active " },
          { text: "at night to hunt for food such as shrimp, crabs, and small fish.", italic: true },
        ],
      ],
    },
  },
  {
    slug: "walking-shark-divemaster",
    title: "Walking Shark | Divemaster",
    publicId: "Shark_3.webp",
    alt: {
      en: "Illustration of a walking shark with an open mouth and a blue sneaker over coral reef",
      id: "Ilustrasi walking shark bermulut terbuka bersepatu biru di atas terumbu karang",
    },
    caption: {
      id: [
        [
          { text: "Walking shark", bold: true },
          { text: " adalah satwa endemik " },
          { text: "Maluku Utara", bold: true },
          { text: " yang dilindungi, untuk itu Pemerintah " },
          { text: "Republik Indonesia", bold: true },
          { text: " telah menetapkan perlindungan penuh terhadap semua spesies " },
          { text: "walking shark", bold: true },
          { text: " melalui " },
          { text: "Keputusan Menteri Kelautan dan Perikanan No. 30 Tahun 2023", bold: true },
          { text: ". Ancaman langsung terkait eksistensi satwa ini adalah adanya " },
          { text: "reklamasi pesisir", bold: true },
          { text: " yang mengubah pola arus laut dan merusak habitat, " },
          { text: "pencemaran logam berat", bold: true },
          { text: ", terutama merkuri dari aktivitas pertambangan, serta " },
          { text: "penangkapan", bold: true },
          { text: " tidak sengaja oleh nelayan karena jaring." },
        ],
      ],
      en: [
        [
          { text: "The ", italic: true },
          { text: "walking shark ", bold: true, italic: true },
          { text: "is an endemic species of ", italic: true },
          { text: "North Maluku ", bold: true, italic: true },
          { text: "that is protected. In response, the Government of the ", italic: true },
          { text: "Republic of Indonesia ", bold: true, italic: true },
          { text: "has granted full protection to all ", italic: true },
          { text: "walking shark ", bold: true, italic: true },
          { text: "species through ", italic: true },
          { text: "Ministerial Decree No. 30 of 2023 ", bold: true, italic: true },
          { text: "issued by the ", italic: true },
          { text: "Ministry of Marine Affairs and Fisheries.", bold: true, italic: true },
        ],

        [
          { text: "The primary threats to this species include ", italic: true },
          { text: "coastal reclamation ", bold: true, italic: true },
          { text: "which alters ocean currents and damages habitats, ", italic: true },
          { text: "heavy metal pollution", bold: true, italic: true },
          { text: ", particularly mercury from mining activities, and accidental ", italic: true },
          { text: "capture ", bold: true, italic: true },
          { text: "by fishermen due to entanglement in fishing nets.", italic: true },
        ],
      ],
    },
  },
  {
    slug: "pohon-sagu",
    title: "Pohon Sagu",
    publicId: "Sagu_1.webp",
    alt: {
      en: "Illustration of sago palms drawn in green strokes with SAGO lettering",
      id: "Ilustrasi pohon sagu bergambar goresan hijau dengan huruf SAGO",
    },
    caption: {
      id: [
        [
          { text: "Pohon sagu merupakan tanaman tropis yang tinggi dan memiliki daun bersirip dengan batang silindris. Tanaman ini tumbuh di tanah lembab seperti di daerah rawa, pinggir sungai, atau di pesisir pantai. Batang sagu menghasilkan tepung, sebuah bahan dasar pembuatan makanan popeda/pupeda/papeda. Popeda sendiri adalah makanan pokok masyarakat di kawasan Indonesia Timur." },
        ],
      ],
      en: [
        [
          { text: "The sago palm is a tropical plant that is tall and has pinnate leaves with a cylindrical trunk.", italic: true },
        ],

        [
          { text: "This plant grows in moist soil, such as in swampy areas, riverbanks, or coastal regions.", italic: true },
        ],

        [
          { text: "The sago trunk produces flour, a basic ingredient in making popeda/ pupeda/ papeda.", italic: true },
        ],

        [
          { text: "Popeda itself is a staple food in the eastern regions of Indonesia.", italic: true },
        ],
      ],
    },
  },
  {
    slug: "gamalama-1",
    title: "Gamalama",
    publicId: "Gamalama_1.webp",
    alt: {
      en: "Illustration of Mount Gamalama with an orange smoke plume rising above the sea",
      id: "Ilustrasi Gunung Gamalama dengan kepulan asap jingga di atas laut",
    },
    caption: {
      id: [
        [
          { text: "Inilah Gunung Gamalama, gunung api Ternate yang menjulang setinggi 1.715 mdpl. Namanya berasal dari Bahasa Ternate 'Gam Lamo', atau kampung yang besar. Punggungnya begitu subur, sehingga menjadi rumah bagi pala dan cengkih, dua komoditas yang menjadi pangkal kedatangan bangsa-bangsa Eropa ke Indonesia." },
        ],
      ],
      en: [
        [
          { text: "This is Mount Gamalama, Ternate's volcano, towering at 1,715 meters above sea level. Its name comes from the Ternate language 'Gam Lamo', meaning the big village. Its slopes are so fertile that they are home to nutmeg and cloves, two commodities that prompted European come to Indonesia." },
        ],
      ],
    },
  },
  {
    slug: "gunung-gamalama",
    title: "Gunung Gamalama",
    publicId: "Gunung_Gamalama.webp",
    alt: {
      en: "Night illustration of Mount Gamalama towering over glowing city lights",
      id: "Ilustrasi malam Gunung Gamalama menjulang di atas lampu kota",
    },
    caption: {
      id: [
        [
          { text: "Gunung Gamalama (" },
          { text: "1.715 mdpl", bold: true },
          { text: ") adalah puncak tertinggi di " },
          { text: "Pulau Ternate", bold: true },
          { text: ". Jalur pendakiannya menantang, tapi memesona. Berangkat dari pos " },
          { text: "Kelurahan Moya", bold: true },
          { text: ", pendaki akan melewati hutan tropis lebat sebelum mencapai " },
          { text: "kawah aktif", bold: true },
          { text: " dengan " },
          { text: "gas belerang", bold: true },
          { text: ". Mulailah pendakian pada malam hari, kenakan pakaian nyaman, dan " },
          { text: "tetap waspada", bold: true },
          { text: " terhadap aktivitas vulkanik." },
        ],
      ],
      en: [
        [
          { text: "Mount Gamalama (", italic: true },
          { text: "1,715 meters above sea level", bold: true, italic: true },
          { text: ") is the highest peak on ", italic: true },
          { text: "Ternate Island.", bold: true, italic: true },
        ],

        [
          { text: "Its trekking route is both challenging and captivating. Starting from the post in ", italic: true },
          { text: "Moya,", bold: true, italic: true },
        ],

        [
          { text: "hikers will pass through dense tropical forest before reaching the ", italic: true },
          { text: "active crater ", bold: true, italic: true },
          { text: "emitting ", italic: true },
          { text: "sulfuric gas.", bold: true, italic: true },
        ],

        [
          { text: "Begin your hike at night, wear comfortable clothing, and ", italic: true },
          { text: "stay alert ", bold: true, italic: true },
          { text: "to volcanic activity.", italic: true },
        ],
      ],
    },
  },
  {
    slug: "gunung-dukono",
    title: "Gunung Dukono",
    publicId: "Gunung_Dukono.webp",
    alt: {
      en: "Poster of Mount Dukono with a lava column rising over green hills",
      id: "Poster Gunung Dukono dengan kolom lava menjulang di atas perbukitan hijau",
    },
    caption: {
      id: [
        [
          { text: "Gunung Dukono (" },
          { text: "1.335 mdpl", bold: true },
          { text: ") di " },
          { text: "Halmahera Utara", bold: true },
          { text: " adalah salah satu gunung berapi paling aktif di Indonesia, dengan letusan konstan sejak " },
          { text: "1933", bold: true },
          { text: ". Medan lava hitam dan gemuruh kawah menciptakan pengalaman yang berkesan. Jalur menuju puncak melewati hutan lebat dan " },
          { text: "lereng berabu", bold: true },
          { text: ". Masker gas dan " },
          { text: "pemandu lokal", bold: true },
          { text: " sangat disarankan. Bagi pencinta petualangan " },
          { text: "ekstrem", bold: true },
          { text: ", Dukono menyuguhkan drama vulkanik yang nyata." },
        ],
      ],
      en: [
        [
          { text: "Mount Dukono (", italic: true },
          { text: "1,335 m", bold: true, italic: true },
          { text: ") in ", italic: true },
          { text: "North Halmahera", bold: true, italic: true },
          { text: " is one of Indonesia’s most active volcanoes, with uninterrupted eruptions since ", italic: true },
          { text: "1933.", bold: true, italic: true },
        ],

        [
          { text: "Its black lava fields and the roar of its crater offer a truly memorable experience.", italic: true },
        ],

        [
          { text: "The trail to the summit winds through dense forest and ", italic: true },
          { text: "ash-covered slopes.", bold: true, italic: true },
        ],

        [
          { text: "A gas mask and ", italic: true },
          { text: "local guide ", bold: true, italic: true },
          { text: "are highly recommended.", italic: true },
        ],

        [
          { text: "For lovers of ", italic: true },
          { text: "extreme ", bold: true, italic: true },
          { text: "adventure, Dukono delivers raw volcanic drama.", italic: true },
        ],
      ],
    },
  },
  {
    slug: "gunung-gamkonora",
    title: "Gunung Gamkonora",
    publicId: "Gunung_Gamkonora.webp",
    alt: {
      en: "Illustration of the Gamkonora caldera cliffs under a turquoise sky",
      id: "Ilustrasi tebing kaldera Gamkonora di bawah langit turquoise",
    },
    caption: {
      id: [
        [
          { text: "Gunung Gamkonora (" },
          { text: "1.673 mdpl", bold: true },
          { text: ") terletak di Kecamatan Ibu, " },
          { text: "Halmahera Barat", bold: true },
          { text: ", Maluku Utara. Kawahnya memanjang dari " },
          { text: "utara ke selatan", bold: true },
          { text: " akibat serangkaian letusan. Tahun " },
          { text: "1673", bold: true },
          { text: " terjadi letusan hebat, memicu " },
          { text: "tsunami", bold: true },
          { text: ", dan menghancurkan desa-desa sekitar. Setelah itu Gamkonora kembali erupsi pada " },
          { text: "2007", bold: true },
          { text: " dan " },
          { text: "2012", bold: true },
          { text: ", menyebabkan ribuan warga " },
          { text: "mengungsi", bold: true },
          { text: ". Jalurnya menawarkan lanskap " },
          { text: "dramatis", bold: true },
          { text: " dengan pemandangan terbuka." },
        ],
      ],
      en: [
        [
          { text: "Mount Gamkonora (", italic: true },
          { text: "1,673 m", bold: true, italic: true },
          { text: ") sits in ", italic: true },
          { text: "West Halmahera", bold: true, italic: true },
          { text: "’" },
          { text: "s Ibu District, North Maluku.", italic: true },
        ],

        [
          { text: "Its crater stretches ", italic: true },
          { text: "north to south, ", bold: true, italic: true },
          { text: "shaped by series of eruptions.", italic: true },
        ],

        [
          { text: "In ", italic: true },
          { text: "1673, ", bold: true, italic: true },
          { text: "a major eruption triggered a ", italic: true },
          { text: "tsunami ", bold: true, italic: true },
          { text: "that wiped out villages.", italic: true },
        ],

        [
          { text: "More eruptions followed in ", italic: true },
          { text: "2007 ", bold: true, italic: true },
          { text: "and ", italic: true },
          { text: "2012, ", bold: true, italic: true },
          { text: "forcing thousands to ", italic: true },
          { text: "evacuate.", bold: true, italic: true },
        ],

        [
          { text: "The trail offers a ", italic: true },
          { text: "dramatic ", bold: true, italic: true },
          { text: "landscape and sweeping views.", italic: true },
        ],
      ],
    },
  },
  {
    slug: "kalamata",
    title: "Kalamata",
    publicId: "Kalamata_1.webp",
    alt: {
      en: "Illustration of the dark Kalamata fort mound against a pale blue sky",
      id: "Ilustrasi gundukan Benteng Kalamata yang gelap di langit biru muda",
    },
    caption: {
      id: [
        [
          { text: "Nama benteng ini diambil dari nama Pangeran Kalamata, adik dari Sultan Mandarsyah. Benteng Kalamata dibangun pada tahun 1540 oleh Portugis dengan nama asli Fort Santa Lucia. Kalamata berbentuk kura-kura, memiliki 4 bastion pada empat penjuru mata angin. Struktur bangunannya terbuat dari susunan batu andesit dan batu karang, direkatkan dengan kelero atau sejenis batu kapur yang dihasilkan dari pembakaran karang, campuran pasir, dan air rendaman kulit pohon lubiri." },
        ],
      ],
      en: [
        [
          { text: "The name of this fort is derived", italic: true },
          { text: " from " },
          { text: "Prince Kalamata", italic: true },
          { text: ", " },
          { text: "the younger brother of Sultan Mandarsyah.", italic: true },
        ],

        [
          { text: "Fort Kalamata", italic: true },
          { text: " was built " },
          { text: "in", italic: true },
          { text: " 1540 " },
          { text: "by the", italic: true },
          { text: " Portuguese " },
          { text: "under its original name,", italic: true },
          { text: " Fort Santa Lucia." },
        ],

        [
          { text: "Kalamata", italic: true },
          { text: " is shaped " },
          { text: "like a", italic: true },
          { text: " turtle " },
          { text: "and", italic: true },
          { text: " has 4 " },
          { text: "bastions at the four", italic: true },
          { text: " cardinal " },
          { text: "points.", italic: true },
        ],

        [
          { text: "The structure is made of andesite stones and coral rocks, bonded with kelero, a type of limestone produced from burning coral, mixed with sand and the soaking water of lubiri tree bark.", italic: true },
        ],
      ],
    },
  },
];
