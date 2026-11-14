import { FAQS } from "@/lib/preview-data";

export function Faq() {
  return (
    <div>
      {FAQS.map((f) => (
        <details key={f.q} className="group border-t border-line">
          <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-3 font-serif text-[22px] font-medium [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <span aria-hidden="true" className="text-2xl leading-none text-accent group-open:hidden">+</span>
            <span aria-hidden="true" className="hidden text-2xl leading-none text-accent group-open:inline">−</span>
          </summary>
          <p className="mb-5 max-w-[600px] text-muted">{f.a}</p>
        </details>
      ))}
      <div className="border-t border-line" />
    </div>
  );
}
