"use client";


export default function PortalQuestHome() {

  return (
    <div className="min-h-screen w-full text-white font-sans overflow-x-hidden selection:bg-[#a3e635] selection:text-black">
      {/* Custom Styles for 3D Dice and Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .neon-border { border-color: #a3e635; }
        .neon-text { color: #a3e635; }
        .neon-bg { background-color: #a3e635; }

        /* Custom Scrollbar for Quick Links */
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: #26163b; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #a3e635; border-radius: 10px; }
      `}} />

      <main className=" flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full">
          
          {/* =========================================
              RIGHT COLUMN (AI, Scenarios, Spells) - Span 8
          ========================================= */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* SECTION 2: Header (User Profile) */}
            <header className="self-start flex items-center gap-4 border border-[#a3e635] rounded-full px-4 py-2 bg-[#201236]/80 backdrop-blur-sm">
              <span className="font-bold">Hi <span className="neon-text">ALI</span></span>
              <div className="h-4 w-px bg-gray-500"></div>
              <span className="text-sm cursor-pointer hover:text-white/80">characters</span>
              <div className="h-4 w-px bg-gray-500"></div>
              <span className="text-sm cursor-pointer hover:text-white/80">saved</span>
              <div className="h-4 w-px bg-gray-500"></div>
              <button className="bg-[#a3e635] text-black font-bold px-4 py-1 rounded-full text-sm hover:bg-[#8ec72d] transition-colors flex items-center gap-2">
                profile
                <div className="w-6 h-6 bg-[#170c24] rounded-full overflow-hidden border border-black">
                  {/* Avatar Image Placeholder */}
                  <div className="w-full h-full bg-blue-500"></div> 
                </div>
              </button>
            </header>

            {/* SECTION 3: AI Hero Section */}
            <div className="relative border-2 border-[#a3e635] rounded-[2.5rem] bg-gradient-to-br from-[#2b1945] to-[#1a0f2e] p-8 lg:p-12 min-h-[350px] flex flex-col justify-center overflow-hidden group">
              {/* Knight Image Placeholder (Background Right) */}
              <div className="absolute left-0 bottom-0 w-[40%] h-[110%] bg-gradient-to-t from-green-900/40 to-transparent pointer-events-none rounded-bl-[2.5rem]">
                 {/* To use your image: 
                   <img src="/knight.png" className="absolute bottom-0 left-0 object-cover h-full" alt="Knight" /> 
                 */}
              </div>

              <div className="relative z-10 w-full lg:w-[60%]">
                <h1 className="text-3xl lg:text-4xl font-black mb-2 neon-text">پورتال،</h1>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">به دنیای دی اند دی باز شده!</h2>
                <p className="text-lg text-gray-300 mb-8">با AI قدم بردار</p>
                
                {/* AI Input */}
                <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                  <input 
                    type="text" 
                    placeholder="Ask anything" 
                    className="w-full bg-[#352250]/80 border-2 border-gray-500/50 focus:border-[#a3e635] text-white rounded-2xl px-6 py-4 outline-none transition-colors backdrop-blur-sm"
                  />
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:neon-text transition-colors">
                    {/* Send Icon */}
                    <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  Powered by <span className="text-[#a3e635] font-bold">Gemini</span>
                </div>
              </div>
            </div>

            {/* SECTION 4: Latest Scenarios */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
               {/* See More Button */}
               <div className="flex flex-col items-center justify-center gap-2 lg:w-24 shrink-0 opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
                  <span className="text-xs uppercase tracking-widest text-center">&lt; see<br/>more</span>
                  {/* Pixel Fire Icon Placeholder */}
                  <div className="w-8 h-8 bg-green-500/20 rounded"></div> 
               </div>

               {/* Cards Container */}
               <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1 */}
                  <div className="border border-[#a3e635] rounded-3xl overflow-hidden relative group cursor-pointer aspect-square bg-[#2b1945]">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                     <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                        <h3 className="font-bold text-sm">The Glass Pact of Infernia</h3>
                        <span className="neon-text font-serif text-xl">&amp;</span>
                     </div>
                  </div>
                  {/* Card 2 */}
                  <div className="border border-[#a3e635] rounded-3xl overflow-hidden relative group cursor-pointer aspect-square bg-[#2b1945]">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                     <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                        <h3 className="font-bold text-sm">The Crossroads Tavern</h3>
                        <span className="neon-text font-serif text-xl">&amp;</span>
                     </div>
                  </div>
                  {/* Card 3 */}
                  <div className="border border-[#a3e635] rounded-3xl overflow-hidden relative group cursor-pointer aspect-square bg-[#2b1945]">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                     <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                        <h3 className="font-bold text-sm">Siege of the Emerald Mist</h3>
                        <span className="neon-text font-serif text-xl">&amp;</span>
                     </div>
                  </div>
               </div>

               {/* Scenario Title Box */}
               <div className="border border-[#a3e635] rounded-3xl p-6 bg-[#211333] flex flex-col justify-center items-center gap-2 lg:w-40 shrink-0">
                  <div className="w-12 h-12 bg-[#a3e635] rounded text-black flex items-center justify-center font-serif text-2xl font-bold">&amp;</div>
                  <h3 className="text-center font-bold text-sm mt-2">جدیدترین<br/>سناریوها</h3>
               </div>
            </div>

            {/* SECTION 5: Rules / Spells Slider */}
            <div className="border border-[#a3e635] rounded-full p-4 pr-8 bg-gradient-to-r from-[#211333] to-[#1a0f2e] flex justify-between items-center cursor-pointer hover:bg-[#2b1945] transition-colors overflow-hidden relative">
               <div className="flex items-center gap-4">
                  {/* See more text */}
                  <span className="text-xs uppercase opacity-70">&lt; see<br/>more</span>
                  {/* Pixel Fire Hand Icon Placeholder */}
                  <div className="w-10 h-10 bg-green-500/20 rounded flex items-center justify-center text-[#a3e635] text-xs">🔥</div>
               </div>
               <h3 className="text-xl lg:text-2xl font-black z-10">همه <span className="font-light">اسپل ها</span> اینجاست!</h3>
               {/* Wizard background placeholder */}
               <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-purple-900/50 to-transparent pointer-events-none"></div>
            </div>

          </div>

          {/* =========================================
              LEFT COLUMN (Community, Links, Weapons) - Span 4
          ========================================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* SECTION 6: Community Header */}
            <div className="border border-[#a3e635] rounded-[2rem] p-6 bg-[#211333] relative overflow-hidden min-h-[140px] flex items-center">
              {/* Insert actual community image here as background */}
              <div className="absolute inset-0 bg-[url('https://via.placeholder.com/400x200/211333/211333')] opacity-50"></div>
              <h2 className="relative z-10 text-3xl font-black shadow-sm drop-shadow-md">کامیونیتی</h2>
              <span className="absolute left-6 top-6 text-[10px] uppercase opacity-70">&lt; see<br/>more</span>
            </div>

            {/* SECTION 7: Quick Links / Blogs */}
            <div className="flex-1 overflow-y-auto custom-scroll pl-4 flex flex-col gap-4 max-h-[300px] lg:max-h-none">
               {[
                 'چجوری کاراکتر بسازم؟', 
                 'چجوری قوی تر بشم؟', 
                 'پوشن ها چی هستن؟'
               ].map((title, idx) => (
                 <div key={idx} className="border border-gray-600 hover:border-[#a3e635] rounded-full p-4 flex justify-between items-center bg-[#211333] cursor-pointer transition-all group">
                   <span className="font-bold text-sm lg:text-base">{title}</span>
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-[#a3e635] rounded-full"></span>
                     <span className="w-1.5 h-1.5 bg-[#a3e635] rounded-full"></span>
                     <svg className="w-5 h-5 text-[#a3e635] group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                   </div>
                 </div>
               ))}
            </div>

            {/* SECTION 8: Weapons / Combat Rules */}
            <div className="border-2 border-[#a3e635] rounded-[2.5rem] p-6 lg:p-8 bg-gradient-to-tr from-[#170c24] to-[#253e1a] relative overflow-hidden flex flex-col justify-end min-h-[250px] lg:min-h-[350px] group cursor-pointer">
              {/* Elf Archer Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10 pointer-events-none"></div>
              {/* <img src="/elf-archer.png" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Archer" /> */}

              <div className="relative z-20 flex flex-col items-start w-full">
                <div className="bg-[#170c24]/80 border border-[#a3e635] rounded-full px-4 py-2 mb-4 backdrop-blur-sm self-end">
                  <span className="text-xs font-bold">مشاهده <br/>بخش سلاح و جنگ</span>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-black leading-tight text-right w-full">
                  <span className="neon-text">مرگ</span> با افتخار<br/>یا زنده موندن با <span className="neon-text">نفرین</span>
                </h3>
                
                {/* Crossed Swords Icon */}
                <div className="absolute bottom-6 left-6 text-[#a3e635]">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>

          </div>

        </main>
    </div>
  );
}