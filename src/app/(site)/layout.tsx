import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <a href="#utama" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on">
        Terus ke kandungan
      </a>
      <Header />
      <main id="utama" className="mx-auto max-w-page px-6 pb-[110px] sm:pb-20">
        {children}
      </main>
      <TabBar />
      <Footer />
    </CartProvider>
  );
}
