"use client";

import { useState } from "react";
import { PlayIcon } from "./ui";

/** Benam video YouTube/Vimeo. iframe dimuat hanya selepas diklik (laju + privasi). */
export function VideoPlayer({ embedUrl, title }: { embedUrl: string; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="aspect-video w-full overflow-hidden rounded-[20px] bg-ink">
      {on ? (
        <iframe
          src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setOn(true)}
          aria-label={`Main video: ${title}`}
          className="flex h-full w-full items-center justify-center"
        >
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-accent text-on">
            <PlayIcon size={24} />
          </span>
        </button>
      )}
    </div>
  );
}
