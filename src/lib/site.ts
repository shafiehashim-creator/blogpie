export const SITE_NAME = "Shafie Hashim";
export const SITE_TAGLINE = "Penerbit · Penulis · Pemimpin";
export const SITE_DESCRIPTION =
  "Pengajaran, kesilapan dan pandangan tentang dunia buku, daripada kerusi pemimpin yang bergerak pantas.";

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export const PAGE_SIZE = 12;
