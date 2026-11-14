import sanitizeHtml from "sanitize-html";

const EMBED_HOSTS = ["www.youtube-nocookie.com", "player.vimeo.com"];

/**
 * Tukar pautan YouTube/Vimeo biasa kepada URL benam yang selamat.
 * Hanya dua hos ini dibenarkan. Pulang null jika bukan pautan sah.
 */
export function toEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  let u: URL;
  try {
    u = new URL(input.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const host = u.hostname.replace(/^www\./, "");
  const parts = u.pathname.split("/").filter(Boolean);

  let yt: string | null = null;
  if (host === "youtu.be") yt = parts[0] ?? null;
  else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (parts[0] === "watch") yt = u.searchParams.get("v");
    else if (["embed", "shorts", "live"].includes(parts[0])) yt = parts[1] ?? null;
  }
  if (yt && /^[\w-]{11}$/.test(yt)) return `https://www.youtube-nocookie.com/embed/${yt}`;

  let vm: string | null = null;
  if (host === "vimeo.com") vm = parts[0] ?? null;
  else if (host === "player.vimeo.com" && parts[0] === "video") vm = parts[1] ?? null;
  if (vm && /^\d+$/.test(vm)) return `https://player.vimeo.com/video/${vm}`;

  return null;
}

/** Bersihkan HTML artikel. Dipanggil semasa simpan dan semasa papar. */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
      "blockquote", "hr", "code", "pre", "img", "div", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      div: ["class"],
      iframe: ["src", "allowfullscreen", "title", "loading", "allow"],
    },
    allowedClasses: { div: ["video-embed"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    allowedIframeHostnames: EMBED_HOSTS,
    exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, rel: "noopener noreferrer nofollow" },
      }),
    },
  });
}

export function htmlToText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Anggaran masa baca (≈200 patah perkataan seminit), minimum 1. */
export function readingMinutes(text: string): number {
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}
