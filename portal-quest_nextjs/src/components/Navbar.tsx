"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Spells", href: "/spells" },
  { label: "Classes", href: "/classes" },
  { label: "Monsters", href: "/monsters" },
  { label: "Items", href: "/items" },
  { label: "Rules", href: "/rules" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on homepage
  if (pathname === "/") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-lime-400/10 bg-[#120317]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-400/25 bg-gradient-to-br from-[#311046] to-[#120317] shadow-[0_0_25px_rgba(163,230,53,0.15)] transition group-hover:border-lime-400/60">
            <span className="text-lg font-black text-lime-300">
              ✦
            </span>
          </div>

          <div>
            <h1 className="text-lg font-extrabold tracking-wide text-lime-300">
              Portal
            </h1>

            <p className="text-xs text-zinc-500">
              D&D Compendium
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  rounded-full px-4 py-2 text-sm font-medium transition
                  ${
                    active
                      ? "bg-lime-400 text-[#120317]"
                      : "text-zinc-300 hover:bg-lime-400/10 hover:text-lime-300"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="hidden items-center rounded-full border border-lime-400/10 bg-[#1A0622] px-4 py-2 lg:flex">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />
          </div>

          {/* Profile */}
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-lime-400/20 bg-[#22052D] text-lime-300">
            ⚔
          </button>
        </div>
      </div>
    </header>
  );
}
