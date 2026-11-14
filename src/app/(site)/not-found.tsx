import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="py-20">
      <h1 className="mb-3 font-serif text-5xl font-medium">Halaman tidak dijumpai</h1>
      <p className="mb-7 text-muted">Pautan mungkin telah berubah, atau tulisan belum diterbitkan.</p>
      <ButtonLink href="/tulisan">Ke senarai tulisan</ButtonLink>
    </section>
  );
}
