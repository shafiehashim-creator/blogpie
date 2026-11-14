"use client";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { toEmbedUrl } from "@/lib/content";
import { VideoEmbed } from "@/lib/video-embed";

type Props = {
  initialHtml: string;
  initialJson: unknown;
  onChange: (html: string, json: unknown) => void;
};

function Btn({ on, label, active, children, disabled }: { on: () => void; label: string; active?: boolean; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={on}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`h-10 min-w-10 rounded-lg px-2 text-sm font-medium disabled:opacity-40 ${active ? "bg-accent text-on" : "hover:bg-soft"}`}
    >
      {children}
    </button>
  );
}

export function Editor({ initialHtml, initialJson, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } }),
      Image,
      VideoEmbed,
      Placeholder.configure({ placeholder: "Mula menulis di sini…" }),
    ],
    content: (initialJson as object | null) || initialHtml || "",
    editorProps: {
      attributes: { class: "prose-article min-h-[360px] px-5 py-4 focus:outline-none", "aria-label": "Isi artikel" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML(), editor.getJSON()),
  });

  if (!editor) return <div className="min-h-[420px] rounded-2xl border border-line bg-surface" />;

  function setLink() {
    const prev = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Pautan (https://… atau mailto:…)", prev ?? "https://");
    if (url === null) return;
    if (url === "") return void editor!.chain().focus().extendMarkRange("link").unsetLink().run();
    if (!/^(https?:\/\/|mailto:)/i.test(url)) return setMsg("Pautan mesti bermula dengan https://, http:// atau mailto:");
    setMsg("");
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function addVideo() {
    const url = window.prompt("Pautan YouTube atau Vimeo");
    if (!url) return;
    const embed = toEmbedUrl(url);
    if (!embed) return setMsg("Pautan video mesti daripada YouTube atau Vimeo.");
    setMsg("");
    editor!.chain().focus().insertContent({ type: "videoEmbed", attrs: { src: embed } }).run();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMsg("Memuat naik gambar…");
    const body = new FormData();
    body.set("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal muat naik");
      const alt = window.prompt("Teks alternatif gambar (untuk capaian & SEO)", "") ?? "";
      editor!.chain().focus().setImage({ src: json.url, alt }).run();
      setMsg("");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Gagal muat naik");
    }
  }

  const c = () => editor.chain().focus();
  return (
    <div className="rounded-2xl border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-1 border-b border-line p-2" role="toolbar" aria-label="Alat penyuntingan">
        <Btn label="Tebal" active={editor.isActive("bold")} on={() => c().toggleBold().run()}><b>B</b></Btn>
        <Btn label="Condong" active={editor.isActive("italic")} on={() => c().toggleItalic().run()}><i>I</i></Btn>
        <Btn label="Tajuk besar" active={editor.isActive("heading", { level: 2 })} on={() => c().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn label="Tajuk kecil" active={editor.isActive("heading", { level: 3 })} on={() => c().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <Btn label="Senarai bertitik" active={editor.isActive("bulletList")} on={() => c().toggleBulletList().run()}>• Senarai</Btn>
        <Btn label="Senarai bernombor" active={editor.isActive("orderedList")} on={() => c().toggleOrderedList().run()}>1. Senarai</Btn>
        <Btn label="Petikan" active={editor.isActive("blockquote")} on={() => c().toggleBlockquote().run()}>“ ”</Btn>
        <Btn label="Pautan" active={editor.isActive("link")} on={setLink}>Pautan</Btn>
        <Btn label="Gambar" on={() => fileRef.current?.click()}>Gambar</Btn>
        <Btn label="Video YouTube atau Vimeo" on={addVideo}>Video</Btn>
        <Btn label="Garis pemisah" on={() => c().setHorizontalRule().run()}>―</Btn>
        <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
        <Btn label="Buat asal" disabled={!editor.can().undo()} on={() => c().undo().run()}>↶</Btn>
        <Btn label="Ulang" disabled={!editor.can().redo()} on={() => c().redo().run()}>↷</Btn>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={onFile} />
      </div>
      <EditorContent editor={editor} />
      {msg && <p role="status" className="border-t border-line px-4 py-2 text-sm text-muted">{msg}</p>}
    </div>
  );
}
