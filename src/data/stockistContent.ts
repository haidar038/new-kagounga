import type { Locale } from "../i18n";

export interface StockistPageCopy {
  seoTitle: string;
  description: string;
  title: string;
  lede: string;
  paragraphs: string[];
}

/**
 * City landing copy for the stockist pages. Location names and coordinates
 * stay in `locations.ts`; this file only holds editorial copy and metadata.
 */
export const STOCKIST_PAGES: Record<
  string,
  Record<Locale, StockistPageCopy>
> = {
  ternate: {
    en: {
      seoTitle: "Kagōunga Stockists in Ternate, North Maluku | Kagōunga",
      description:
        "Find Kagōunga popeda, sago, and North Moluccan spices at our Ternate hubs, airport outlets, hotel partners, and local stores across North Maluku.",
      title: "Find Kagōunga in Ternate.",
      lede: "Our home base, with the widest choice of retail points and the fastest access to the Kagōunga team.",
      paragraphs: [
        "Ternate is where Kagōunga began, and it remains the best place to see the full range in person. The city has our North and South hubs, airport counters, hotel partners, and a network of local stores that carry popeda and our pantry staples.",
        "If you are visiting, start with the airport departure outlets for a last-minute gift, or visit the hubs and partner stores for a broader selection. Availability can vary by store; contact us if you need a specific product.",
        "For wholesale, hotel, or retail partnerships in Ternate and the surrounding islands, contact the team to discuss supply and the right pack size for your shelf.",
      ],
    },
    id: {
      seoTitle: "Toko Kagōunga di Kota Ternate, Maluku Utara | Kagōunga",
      description:
        "Temukan popeda, sagu, dan rempah Maluku Utara Kagōunga di hub Ternate, outlet bandara, hotel, dan toko lokal di seluruh Maluku Utara.",
      title: "Temukan Kagōunga di Ternate.",
      lede: "Basis kami, dengan pilihan titik ritel paling lengkap dan akses tercepat ke tim Kagōunga.",
      paragraphs: [
        "Ternate adalah tempat Kagōunga dimulai, dan tetap menjadi tempat terbaik untuk melihat rangkaian produk secara langsung. Di kota ini ada North dan South Hub, counter bandara, hotel partner, serta jaringan toko lokal yang menjual popeda dan bahan pokok kami.",
        "Jika sedang berkunjung, mulai dari outlet keberangkatan bandara untuk oleh-oleh terakhir, atau datang ke hub dan toko partner untuk pilihan lebih luas. Ketersediaan dapat berbeda di tiap toko; hubungi kami jika mencari produk tertentu.",
        "Untuk kemitraan grosir, hotel, atau ritel di Ternate dan pulau sekitarnya, hubungi tim kami untuk membahas pasokan dan ukuran kemasan yang sesuai untuk rak Anda.",
      ],
    },
  },
  tidore: {
    en: {
      seoTitle: "Kagōunga Stockists in Tidore, North Maluku | Kagōunga",
      description:
        "Find Kagōunga products in Tidore at our partner gallery in Soasio, alongside local woven textiles and island crafts from the Spice Islands.",
      title: "Find Kagōunga in Tidore.",
      lede: "A partner point in Soasio for visitors exploring Tidore and the wider North Maluku islands.",
      paragraphs: [
        "Tidore is a short boat ride from Ternate and a natural stop for anyone tracing the history of the Spice Islands. Our partner point in Soasio sits alongside local woven textiles, making it a convenient place to pick up Kagōunga products and a piece of island craft in one visit.",
        "The range in Tidore is focused on pantry staples and gifts. Availability can vary by store, so it is worth contacting the partner or our team before making a special trip for a specific item.",
        "Retailers and hospitality businesses in Tidore can contact Kagōunga to discuss supply and how to present the products alongside local food and craft.",
      ],
    },
    id: {
      seoTitle: "Toko Kagōunga di Kota Tidore, Maluku Utara | Kagōunga",
      description:
        "Temukan produk Kagōunga di Tidore melalui galeri partner kami di Soasio, bersama tenun lokal dan kerajinan kepulauan Maluku Utara.",
      title: "Temukan Kagōunga di Tidore.",
      lede: "Titik partner di Soasio untuk pengunjung yang menjelajahi Tidore dan kepulauan Maluku Utara.",
      paragraphs: [
        "Tidore hanya beberapa menit naik perahu dari Ternate dan menjadi persinggahan alami bagi siapa pun yang menelusuri sejarah Kepulauan Rempah. Titik partner kami di Soasio berada dekat tenun lokal, sehingga mudah membeli produk Kagōunga sekaligus kerajinan pulau dalam satu kunjungan.",
        "Pilihan produk di Tidore berfokus pada bahan pokok dan hadiah. Ketersediaan dapat berbeda di tiap toko, jadi sebaiknya hubungi partner atau tim kami sebelum melakukan perjalanan khusus untuk produk tertentu.",
        "Ritel dan bisnis perhotelan di Tidore dapat menghubungi Kagōunga untuk membahas pasokan dan cara menampilkan produk bersama makanan serta kerajinan lokal.",
      ],
    },
  },
  denpasar: {
    en: {
      seoTitle: "Kagōunga Stockists in Denpasar & Sanur, Bali | Kagōunga",
      description:
        "Shop Kagōunga in Bali at our Renon hub in Denpasar and JAVARA House Sanur - popeda, sago, and North Moluccan spices for kitchens and gift retail.",
      title: "Find Kagōunga in Denpasar.",
      lede: "Our Bali hub in Renon and a partner point in Sanur connect North Moluccan pantry staples to the island.",
      paragraphs: [
        "Bali is a key market for Kagōunga outside North Maluku. The Renon hub supports local retail and hospitality, while JAVARA House Sanur gives visitors a chance to browse the range in a curated setting.",
        "The Bali assortment is built around popeda, sago, and the spice pantry, with pack sizes suited to home kitchens, cafes, and gift retail. If you are staying in the south, Sanur is the easiest place to start; for larger or repeat orders, contact the Renon hub.",
        "Cafes, hotels, and retailers across Bali can contact the team to discuss product selection and supply for a menu or retail shelf.",
      ],
    },
    id: {
      seoTitle: "Toko & Stokis Kagōunga di Denpasar & Sanur | Kagōunga",
      description:
        "Beli produk Kagōunga di Bali melalui hub Renon di Denpasar dan JAVARA House Sanur - popeda, sagu, dan rempah Maluku Utara untuk dapur dan ritel hadiah.",
      title: "Temukan Kagōunga di Denpasar.",
      lede: "Hub Bali kami di Renon dan titik partner di Sanur menghubungkan bahan pokok Maluku Utara ke pulau ini.",
      paragraphs: [
        "Bali adalah pasar utama Kagōunga di luar Maluku Utara. Hub Renon melayani ritel dan perhotelan lokal, sementara JAVARA House Sanur memberi kesempatan bagi pengunjung untuk melihat rangkaian produk dalam suasana kurasi.",
        "Pilihan produk di Bali berfokus pada popeda, sagu, dan rempah dapur, dengan ukuran kemasan yang cocok untuk dapur rumah, kafe, dan ritel hadiah. Jika menginap di area selatan, Sanur adalah titik paling mudah; untuk pesanan besar atau berulang, hubungi hub Renon.",
        "Kafe, hotel, dan ritel di seluruh Bali dapat menghubungi tim kami untuk membahas pemilihan produk dan pasokan untuk menu atau rak toko.",
      ],
    },
  },
  bandung: {
    en: {
      seoTitle: "Kagōunga Stockists in Bandung, West Java | Kagōunga",
      description:
        "Find Kagōunga products in Bandung at Rasta Timur Asli, Bandung Wetan: sago, turmeric fish seasoning, and Moluccan spices for local kitchens.",
      title: "Find Kagōunga in Bandung.",
      lede: "A partner point in Bandung Wetan for pantry staples and North Moluccan flavours.",
      paragraphs: [
        "Bandung's food and design scene makes it a natural home for Kagōunga's pantry range. Our partner, Rasta Timur Asli in Bandung Wetan, carries the products for customers who want to cook with sago, turmeric fish seasoning, and Moluccan spices.",
        "The selection is compact and changes with demand. If you are looking for a specific product or a larger quantity, contact us and we can check availability with the partner.",
        "Cafes, restaurants, and retailers in Bandung can also contact us to discuss supply, menu applications, and pack formats.",
      ],
    },
    id: {
      seoTitle: "Toko & Stokis Kagōunga di Bandung, Jawa Barat | Kagōunga",
      description:
        "Temukan produk Kagōunga di Bandung melalui Rasta Timur Asli di Bandung Wetan: sagu, bumbu kunyit ikan, dan rempah Maluku untuk dapur lokal.",
      title: "Temukan Kagōunga di Bandung.",
      lede: "Titik partner di Bandung Wetan untuk bahan pokok dan cita rasa Maluku Utara.",
      paragraphs: [
        "Scene kuliner dan desain Bandung membuat kota ini menjadi tempat alami bagi rangkaian produk dapur Kagōunga. Partner kami, Rasta Timur Asli di Bandung Wetan, menyediakan produk untuk pelanggan yang ingin memasak dengan sagu, bumbu kunyit ikan, dan rempah Maluku.",
        "Pilihannya ringkas dan berubah mengikuti permintaan. Jika mencari produk tertentu atau jumlah lebih besar, hubungi kami agar kami dapat mengecek ketersediaan di partner.",
        "Kafe, restoran, dan ritel di Bandung dapat menghubungi kami untuk membahas pasokan, aplikasi menu, dan format kemasan.",
      ],
    },
  },
  jakarta: {
    en: {
      seoTitle: "Kagōunga Stockists in Kemang, South Jakarta | Kagōunga",
      description:
        "Find Kagōunga products in Jakarta at JAVARA Culture Kemang: a curated retail point for pantry staples, gifts, and Indonesian ingredients.",
      title: "Find Kagōunga in Jakarta.",
      lede: "A curated partner point in Kemang for Jakarta shoppers and gift buyers.",
      paragraphs: [
        "Jakarta is a key market for Indonesian pantry brands, and Kagōunga is available through JAVARA Culture in Kemang. The partner point is a good place to see the range in a curated retail setting, especially if you are shopping for gifts or building a pantry around Indonesian ingredients.",
        "For offices, restaurants, hotels, and retailers, contact the team to discuss supply and the right pack sizes for your needs.",
        "If you need a product urgently, contact us first and we will confirm availability or the nearest stock.",
      ],
    },
    id: {
      seoTitle: "Toko & Stokis Kagōunga di Kemang, Jakarta | Kagōunga",
      description:
        "Temukan produk Kagōunga di Jakarta melalui JAVARA Culture Kemang: titik ritel terkurasi untuk bahan pokok, hadiah, dan bahan Indonesia.",
      title: "Temukan Kagōunga di Jakarta.",
      lede: "Titik partner terkurasi di Kemang untuk pembeli dan pencari hadiah di Jakarta.",
      paragraphs: [
        "Jakarta adalah pasar penting bagi brand bahan makanan Indonesia, dan Kagōunga tersedia melalui JAVARA Culture di Kemang. Titik partner ini cocok untuk melihat rangkaian produk dalam suasana ritel terkurasi, terutama untuk belanja hadiah atau melengkapi dapur dengan bahan Indonesia.",
        "Untuk kantor, restoran, hotel, dan ritel, hubungi tim kami untuk membahas pasokan dan ukuran kemasan yang sesuai.",
        "Jika membutuhkan produk mendesak, hubungi kami lebih dahulu dan kami akan memastikan ketersediaan atau stok terdekat.",
      ],
    },
  },
};

export function getStockistPageCopy(
  slug: string,
  locale: Locale,
): StockistPageCopy | null {
  return STOCKIST_PAGES[slug]?.[locale] ?? null;
}
