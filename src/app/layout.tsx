import "./globals.css";
import Navbar from "@/components/Navabr";

export const metadata = {
  title: "Portal Quest Games",
  description: "Modern D&D Toolkit",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body  dir="rtl">
        <section className="w-full mx-auto flex flex-col lg:flex-row min-h-screen p-12.5 gap-30 bg-linear-to-r from-[#1a0c26] to-[#241033]">
          <Navbar />
          {children}
        </section>  
      </body>
    </html>
  );
}