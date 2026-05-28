"use client";
import D20Dice from "./D20Dice";
export default function Navbar() {
    return(
        <nav className="w-23 flex flex-col items-center justify-between">
            <section className="bg-[#391d50] flex flex-col items-center justify-between h-full w-full rounded-2xl border-[#b4ff00] border-3">
                {/* Logo */}
                <div className="text-center font-bold text-xs tracking-widest leading-tight">
                    <span className="neon-text">PORTAL</span><br/>QUEST<br/>GAMES
                </div>

                {/* Login / Reg */}
                <button className="flex flex-col items-center gap-2 hover:scale-110 transition-transform">
                    <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                    </div>
                    <span className="text-[10px] font-bold">LOGIN<br/>REG</span>
                </button>

                <a href="#" className="text-sm font-semibold hover:neon-text transition-colors">Blog</a>
            </section>
            <section className="h-120 w-full relative">
                <aside className="bg-[#b4ff00] h-full w-12.5 mx-auto"></aside>
                {/* 3D Dice Roller */}
                <D20Dice
                    size={100}
                    numberColor="#b4ff00"
                    faceColor="#391d50"
                    edgeColor="#291539"
                    edgeWidth={2}
                    metalness={0.0}
                    roughness={0.0}
                    className="absolute top-0 bottom-0 right-[-12] m-auto"
                />
            </section>
            <section className="bg-[#391d50] w-full h-full rounded-2xl border-[#b4ff00] border-3">
                {/* Social Links */}
            <div className="flex lg:flex-col gap-4 items-center">
                <span className="text-xs font-bold text-center">Portal<br/>Social</span>
                <button className="hover:neon-text transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></button>
                {/* ... Add other social icons similarly */}
            </div>
            </section>
        </nav>
    );
}