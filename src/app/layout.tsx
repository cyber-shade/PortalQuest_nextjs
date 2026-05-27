import "./globals.css";
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "DnD Nexus",
  description: "Modern D&D Toolkit",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#17051F] text-white">

        <Navbar />

        {children}

      </body>
    </html>
  );
}