// Data pratonton untuk Fasa 2 (Kelas) dan Fasa 3 (Kedai). Diambil daripada docs/prototype.html.
// Semua harga ialah placeholder "RM XX". Akan diganti dengan data Supabase bila fasa dibina.

export type PreviewCourse = {
  slug: string;
  title: string;
  blurb: string;
  price: string;
  lessons: { title: string; duration: string }[];
};

export const PREVIEW_COURSES: PreviewCourse[] = [
  {
    slug: "marketing-buku-dari-kosong",
    title: "Marketing Buku dari Kosong",
    blurb: "Dari memahami pembaca sehingga mengukur apa yang benar-benar menjual.",
    price: "RM XX",
    lessons: [
      { title: "Cara fikir pembaca sasaran", duration: "9 min" },
      { title: "Hook yang menghentikan scroll", duration: "12 min" },
      { title: "Susun kempen pelancaran", duration: "14 min" },
      { title: "Ukur apa yang berjaya", duration: "10 min" },
      { title: "Bila untuk reprint atau lelong", duration: "11 min" },
    ],
  },
  {
    slug: "personal-brand-untuk-pemimpin",
    title: "Membina Personal Brand untuk Pemimpin",
    blurb: "Menulis dengan suara sendiri, secara konsisten, tanpa rasa dipaksa.",
    price: "RM XX",
    lessons: [
      { title: "Tentukan suara anda", duration: "8 min" },
      { title: "Tiga jenis tulisan yang berulang", duration: "12 min" },
      { title: "Dari idea ke draf dalam 30 minit", duration: "10 min" },
      { title: "Ritma terbit yang boleh dikekalkan", duration: "9 min" },
    ],
  },
];

export type PreviewProduct = {
  id: string;
  name: string;
  kind: "Digital" | "Fizikal";
  desc: string;
  price: string;
};

export const PREVIEW_PRODUCTS: PreviewProduct[] = [
  { id: "p1", name: "Nota Keputusan Pemimpin", kind: "Digital", desc: "PDF · muat turun segera", price: "RM XX" },
  { id: "p2", name: "Templat Pelan Marketing Buku", kind: "Digital", desc: "Spreadsheet · muat turun segera", price: "RM XX" },
  { id: "p3", name: "Jurnal Keputusan", kind: "Fizikal", desc: "Dihantar melalui kurier", price: "RM XX" },
  { id: "p4", name: "Set Penanda Buku", kind: "Fizikal", desc: "Dihantar melalui kurier", price: "RM XX" },
];

export const FAQS: { q: string; a: string }[] = [
  { q: "Siapa Shafie?", a: "[Dua ayat ringkas tentang latar belakang dan peranan anda.]" },
  { q: "Apa yang akan aku dapat daripada tulisan ini?", a: "[Dua ayat tentang tema: keputusan, pengajaran dan pandangan industri.]" },
  { q: "Bila kelas dan kedai dibuka?", a: '[Tarikh atau "tidak lama lagi". Langgan emel untuk dimaklumkan dahulu.]' },
  {
    q: "Bagaimana bayaran dan penghantaran berfungsi?",
    a: "Bayaran melalui FPX atau kad. Produk digital dimuat turun serta-merta; produk fizikal dihantar melalui kurier.",
  },
];
