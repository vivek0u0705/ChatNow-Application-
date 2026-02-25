import { useState } from "react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [showList, setShowList] = useState(false);

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-xl font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70 mb-6">
            Choose a theme for your chat interface
          </p>

          {/* SELECT BUTTON */}
          <button
            onClick={() => setShowList(!showList)}
            className="btn btn-outline w-full justify-between"
          >
            {theme
              ? theme.charAt(0).toUpperCase() + theme.slice(1)
              : "Select Theme"}
            <span
              className={`transition-transform ${
                showList ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {/* THEME LIST */}
          {showList && (
            <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTheme(t);
                    setShowList(false);
                  }}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-lg transition ${
                    theme === t
                      ? "bg-base-200 font-semibold"
                      : "hover:bg-base-200"
                  }`}
                >
                  <span>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>

                  <div className="flex gap-1" data-theme={t}>
                    <div className="w-4 h-4 rounded bg-primary"></div>
                    <div className="w-4 h-4 rounded bg-secondary"></div>
                    <div className="w-4 h-4 rounded bg-accent"></div>
                    <div className="w-4 h-4 rounded bg-neutral"></div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE PREVIEW */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Preview</h3>

          <div className="rounded-2xl border border-base-300 bg-base-100 shadow-xl overflow-hidden">
            <div className="p-6 bg-base-200">
              <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden">

                {/* Header */}
                <div className="px-4 py-3 border-b border-base-300 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-semibold">
                      V
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-base-100 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Vicky</h3>
                    <p className="text-xs text-base-content/60">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4 min-h-[220px]">

                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-base-200 rounded-2xl p-3">
                      <p className="text-sm">
                        Hey Vivek, is the deployment completed?
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="max-w-[75%] bg-primary text-primary-content rounded-2xl p-3">
                      <p className="text-sm">
                        Yes, the application is now live on production.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Input */}
                <div className="p-4 border-t border-base-300">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary">
                      <Send size={18} />
                    </button>
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