import SpellCard from "@/features/spells/components/spell-card";
import { spells } from "@/features/spells/data/spells";

export default function SpellsPage() {
  return (
    <main className="min-h-screen bg-[#17051F] px-6 py-10 text-white">

      {/* Hero */}
      <section className="mx-auto mb-10 max-w-7xl">

        <div className="rounded-3xl border border-lime-400/20 bg-[#21042F] p-8">

          <h1 className="text-5xl font-extrabold text-lime-300">
            Spell Compendium
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-300">
            Browse every spell, discover magical effects,
            and build your perfect caster.
          </p>

          {/* Search */}
          <div className="mt-8 grid gap-4 md:grid-cols-4">

            <input
              placeholder="Search spells..."
              className="rounded-2xl border border-lime-400/20 bg-[#17051F] px-4 py-3 outline-none"
            />

            <select className="rounded-2xl border border-lime-400/20 bg-[#17051F] px-4 py-3">
              <option>All Levels</option>
            </select>

            <select className="rounded-2xl border border-lime-400/20 bg-[#17051F] px-4 py-3">
              <option>All Schools</option>
            </select>

            <button className="rounded-2xl bg-lime-400 px-4 py-3 font-bold text-[#17051F]">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Spell Grid */}
      <section className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">

        {spells.map((spell) => (
          <SpellCard
            key={spell.id}
            spell={spell}
          />
        ))}

      </section>
    </main>
  );
}
