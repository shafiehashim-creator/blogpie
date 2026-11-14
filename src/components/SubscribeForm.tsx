"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions";

export function SubscribeForm({ source, id, cta = "Langgan" }: { source: string; id: string; cta?: string }) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, { status: "idle" });

  if (state.status === "ok") {
    return (
      <p role="status" className="m-0 font-medium text-accent">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="flex flex-wrap gap-2.5" noValidate>
      <label htmlFor={id} className="sr-only">
        Emel
      </label>
      <input
        id={id}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="nama@emel.com"
        className="min-h-[48px] flex-[1_1_200px] rounded-full border border-line bg-surface px-[18px]"
      />
      {/* Perangkap bot, jangan isi */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <input type="hidden" name="source" value={source} />
      <button
        type="submit"
        disabled={pending}
        className="min-h-[48px] rounded-full bg-accent px-6 font-medium text-on hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Menghantar…" : cta}
      </button>
      {state.status === "error" && (
        <p role="alert" className="m-0 w-full text-sm text-red-700 dark:text-red-400">
          {state.message}
        </p>
      )}
    </form>
  );
}
