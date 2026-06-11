import { useState } from "react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [showList, setShowList] = useState(false);

  return (
    <div className="min-h-screen bg-base-200 pt-20 pb-10 flex items-center justify-center">

      <div className="container mx-auto px-4 max-w-6xl z-10 animate-fade-in-up">
        <div className="card glass-panel glass-panel-glow shadow-2xl rounded-3xl p-6 sm:p-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* LEFT SIDE: VISUAL THEME SELECTOR GRID */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold">
                  System Appearance
                </h2>
                <p className="text-sm opacity-60 mt-1">
                  Choose a color layout scheme for your ChatNow dashboard
                </p>
              </div>

              {/* Theme Selector visual cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`group flex flex-col gap-2 p-3.5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden active:scale-[0.97] ${
                      theme === t
                        ? "bg-primary/10 border-primary ring-1 ring-primary/45 shadow-sm"
                        : "bg-base-200/50 border-base-content/10 hover:border-base-content/25 hover:bg-base-200"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-bold tracking-wide group-hover:text-primary transition-colors">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </span>
                      {theme === t && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>

                    {/* DaisyUI theme color swatch previews */}
                    <div className="flex gap-1.5 mt-0.5 items-center w-full" data-theme={t}>
                      <span className="text-[9px] opacity-40 font-semibold tracking-wider mr-auto select-none">PALETTE</span>
                      <div className="w-3.5 h-3.5 rounded-md bg-primary shadow-sm" />
                      <div className="w-3.5 h-3.5 rounded-md bg-secondary shadow-sm" />
                      <div className="w-3.5 h-3.5 rounded-md bg-accent shadow-sm" />
                      <div className="w-3.5 h-3.5 rounded-md bg-neutral shadow-sm" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: PREMIUM LIVE PREVIEW MOCKUP */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-lg font-bold opacity-80">Live View Preview</h3>
                <p className="text-sm opacity-50 mt-1">See how components display in real-time</p>
              </div>

              {/* Mock browser container */}
              <div className="w-full bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-content/10">
                {/* Browser bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-base-200/50 border-b border-base-content/5">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-error/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-warning/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-success/80"></span>
                  </div>
                  <div className="text-[10px] font-medium opacity-40 tracking-wider">chatnow.app</div>
                  <div className="w-10"></div>
                </div>

                {/* Inner Preview Window */}
                <div className="p-4 bg-base-200/40 relative">
                  <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden border border-base-content/5">

                    {/* Chat Header preview */}
                    <div className="px-4 py-3 border-b border-base-content/10 flex items-center gap-3.5 bg-base-100/30">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">
                          V
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 ring-2 ring-base-100 rounded-full"></span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs tracking-wide">Vicky</h3>
                        <p className="text-[10px] opacity-65 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          Online
                        </p>
                      </div>
                    </div>

                    {/* Messages preview */}
                    <div className="p-4 space-y-4 min-h-[200px] text-xs">
                      
                      {/* Incoming bubble */}
                      <div className="flex justify-start">
                        <div className="max-w-[80%] bg-base-200 text-base-content rounded-2xl rounded-tl-none border border-base-content/5 p-3.5 shadow-sm leading-relaxed">
                          <p>Hey Vivek, is the deployment completed?</p>
                        </div>
                      </div>

                      {/* Outgoing bubble */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] bg-primary text-primary-content rounded-2xl rounded-tr-none p-3.5 shadow-sm leading-relaxed">
                          <p>Yes, the application is now live on production.</p>
                        </div>
                      </div>

                    </div>

                    {/* Input preview */}
                    <div className="p-3 bg-base-100/30 border-t border-base-content/10">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input input-bordered rounded-full flex-1 input-sm focus:outline-none input-premium"
                          value="This is a preview text"
                          readOnly
                        />
                        <button className="btn btn-primary btn-sm btn-circle hover:scale-105 active:scale-95 transition-all">
                          <Send size={14} className="translate-x-[0.5px]" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;