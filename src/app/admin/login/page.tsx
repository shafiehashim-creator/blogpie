import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log masuk admin", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ ralat?: string }> }) {
  const { ralat } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-6 py-12">
      <h1 className="mb-6 font-serif text-4xl font-medium">Log masuk admin</h1>
      {ralat === "akses" && <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-400">Akaun ini tiada akses admin.</p>}
      <LoginForm />
    </main>
  );
}
