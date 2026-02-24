import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-8">

        {/* Theme Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition
                ${theme === t ? "bg-base-200 shadow" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div
                className="relative h-8 w-full rounded-md overflow-hidden"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Preview</h3>

          <div className="rounded-2xl border border-base-300 bg-base-100 shadow-xl overflow-hidden">
            <div className="p-6 bg-base-200">
              <div className="max-w-lg mx-auto">

                {/* Chat Container */}
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
                  <div className="p-4 space-y-4 min-h-[220px] max-h-[220px] overflow-y-auto">

                    {/* Incoming */}
                    <div className="flex justify-start">
                      <div className="max-w-[75%] bg-base-200 rounded-2xl p-3 shadow-sm">
                        <p className="text-sm">
                          Hey Vivek, is the deployment completed?
                        </p>
                        <p className="text-[10px] mt-1 text-base-content/60">
                          12:00 PM
                        </p>
                      </div>
                    </div>

                    {/* Sent */}
                    <div className="flex justify-end">
                      <div className="max-w-[75%] bg-primary text-primary-content rounded-2xl p-3 shadow-sm">
                        <p className="text-sm">
                          Yes, the application is now live on production.
                        </p>
                        <p className="text-[10px] mt-1 text-primary-content/70 text-right">
                          12:01 PM
                        </p>
                      </div>
                    </div>

                    {/* Incoming */}
                    <div className="flex justify-start">
                      <div className="max-w-[75%] bg-base-200 rounded-2xl p-3 shadow-sm">
                        <p className="text-sm">
                          Great. The interface looks clean and professional.
                        </p>
                        <p className="text-[10px] mt-1 text-base-content/60">
                          12:02 PM
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-base-300">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-sm h-10"
                        placeholder="Type a message..."
                        value="This is a preview"
                        readOnly
                      />
                      <button className="btn btn-primary h-10 min-h-0">
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
    </div>
  );
};

export default SettingsPage;