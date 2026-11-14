import { Node } from "@tiptap/core";

/** Nod Tiptap untuk benam video YouTube/Vimeo. src mesti URL benam daripada toEmbedUrl(). */
export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [
      {
        tag: "div.video-embed",
        getAttrs: (el) => {
          const src = (el as HTMLElement).querySelector("iframe")?.getAttribute("src");
          return src ? { src } : false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "video-embed" },
      [
        "iframe",
        {
          src: HTMLAttributes.src,
          title: "Video",
          loading: "lazy",
          allowfullscreen: "true",
          allow: "fullscreen; picture-in-picture; encrypted-media",
        },
      ],
    ];
  },
});
