import { Spell } from "../types/spell";

type Props = {
  spell: Spell;
};

export default function SpellCard({ spell }: Props) {
  return (
    <div className="group rounded-3xl border border-lime-400/20 bg-[#21042F] p-5 transition hover:border-lime-400/70 hover:-translate-y-1">

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-lime-300">
            {spell.name}
          </h2>

          <p className="text-sm text-zinc-400">
            Level {spell.level} • {spell.school}
          </p>
        </div>

        {spell.concentration && (
          <div className="rounded-full border border-purple-400 px-3 py-1 text-xs text-purple-300">
            Concentration
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mb-5 flex flex-wrap gap-2">
        {spell.classes.map((cls) => (
          <span
            key={cls}
            className="rounded-full bg-[#34124A] px-3 py-1 text-xs text-zinc-200"
          >
            {cls}
          </span>
        ))}
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm text-zinc-300">

        <div className="flex justify-between">
          <span>Range</span>
          <span>{spell.range.amount} ft</span>
        </div>

        <div className="flex justify-between">
          <span>Casting</span>
          <span>
            {spell.castingTime[0].amount}{" "}
            {spell.castingTime[0].type}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Duration</span>
          <span>
            {spell.duration[0].amount}{" "}
            {spell.duration[0].type}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">

        <div className="flex gap-2">
          {spell.damageTypes.map((damage) => (
            <span
              key={damage}
              className="rounded-full border border-red-500/30 px-2 py-1 text-xs text-red-300"
            >
              {damage}
            </span>
          ))}
        </div>

        <button className="text-sm text-lime-300">
          Details →
        </button>
      </div>
    </div>
  );
}
