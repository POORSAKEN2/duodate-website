import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <article className="legal mx-auto max-w-2xl px-4 pt-32 pb-16 sm:px-6">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}
