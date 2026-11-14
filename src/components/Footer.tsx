export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-wrap justify-between gap-x-8 gap-y-3 px-6 py-7 text-sm text-muted">
        <span>© {new Date().getFullYear()} Shafie Hashim</span>
        <span>Dibina di Vercel · Supabase · GitHub</span>
      </div>
    </footer>
  );
}
