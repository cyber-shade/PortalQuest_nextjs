export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#17051F] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12">

        {/* ستون چپ */}
        <aside className="md:col-span-3 space-y-6">

          <button className="text-sm text-lime-300">see more →</button>

          {/* باکس بزرگ عنوان */}
          <div className="rounded-2xl bg-[#21042F] p-6 border border-lime-400">
            <h2 className="text-3xl font-extrabold text-lime-300">
              کامیونیتی
            </h2>
          </div>

          {/* سه کارت راهنما */}
          <div className="space-y-4">
            {[
              "چجوری کاراکتر بسازم؟",
              "چجوری قوی‌تر بشم؟",
              "پوشن‌ها چی هستن؟",
            ].map((q) => (
              <div
                key={q}
                className="rounded-xl bg-[#21042F] p-4 border border-lime-400/30"
              >
                {q}
              </div>
            ))}
          </div>

          {/* کارت بزرگ پایین */}
          <div className="rounded-2xl bg-[#21042F] p-6 border border-lime-400">
            <h3 className="font-bold text-lg">مرگ با افتخار</h3>
            <p className="text-sm text-lime-300">
              یا زنده موندن با نفرین!
            </p>
          </div>
        </aside>


        {/* ستون وسط */}
        <section className="md:col-span-6 space-y-8">

          {/* خوش آمدگویی */}
          <div className="text-2xl">
            Hi <span className="text-lime-300">ALI</span>
          </div>

          {/* سرچ/چت AI */}
          <div className="rounded-2xl bg-[#21042F] p-6 border border-lime-400/40 space-y-3">
            <h2 className="text-3xl font-extrabold text-lime-300">
              پورتال،  
              <br />
              به دنیای دی‌ اند‌ دی باز شده!
            </h2>

            <input
              placeholder="Ask anything..."
              className="w-full rounded-xl bg-transparent border border-lime-400/40 p-3 text-white"
            />
          </div>

          {/* اسلایدر/کارت‌ها */}
          <div>
            <h3 className="mb-3 text-lime-300 text-sm">see more →</h3>
            <div className="grid grid-cols-2 gap-4">
              {["Infernia", "Crossroads", "Emerald Mist"].map((item) => (
                <div
                  key={item}
                  className="aspect-video rounded-xl bg-[#2A0E3C] border border-purple-500/40 p-4 flex items-end"
                >
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* spels section */}
          <div className="rounded-2xl bg-[#21042F] p-6 border border-lime-400">
            <h3 className="text-2xl font-extrabold">همه اسپیل‌ها اینجاست!</h3>
          </div>
        </section>


        {/* ستون راست */}
        <aside className="md:col-span-3 space-y-6 flex flex-col items-end">

          <div className="rounded-xl bg-[#21042F] border border-lime-400 p-4 w-32 text-center">
            پروفایل
          </div>

          <button className="rounded-xl bg-lime-400 text-black px-6 py-3 font-bold">
            Login / Reg
          </button>

          <button className="rounded-xl bg-[#21042F] border border-purple-500/40 px-6 py-3">
            Blog
          </button>

          <div className="rounded-full bg-[#21042F] border border-lime-400 p-6">
            🎲
          </div>

          <div className="rounded-xl bg-[#21042F] border border-lime-400 p-4">
            Social
          </div>
        </aside>

      </div>
    </main>
  );
}
