import { useEffect, useRef } from "react";

const messages = [
  { user: "Vicky", text: "Hey Vivek, are you online?", type: "left" },
  { user: "Vivek", text: "Yes Vicky, I am here.", type: "right" },
  { user: "Vicky", text: "Is the deployment completed?", type: "left" },
  { user: "Vivek", text: "Yes, it is now live on production.", type: "right" },
  { user: "Vicky", text: "Great. The interface looks clean.", type: "left" },
  { user: "Vivek", text: "Thank you. Real-time updates are working perfectly.", type: "right" },
];

const AnimatedChatPreview = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let scrollAmount = 0;

    const interval = setInterval(() => {
      if (!container) return;

      scrollAmount += 1;
      container.scrollTop = scrollAmount;

      if (scrollAmount >= container.scrollHeight - container.clientHeight) {
        scrollAmount = 0;
        container.scrollTop = 0;
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-content/10 transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20">
      {/* Mock macOS Browser Window Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-base-200/50 border-b border-base-content/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-error/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-warning/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-success/80"></span>
        </div>
        <div className="text-[11px] font-medium opacity-40 tracking-wider">chatnow.app</div>
        <div className="w-10"></div>
      </div>

      <div className="p-6 h-[330px] overflow-hidden bg-base-100/50 backdrop-blur-sm relative">
        <div
          ref={containerRef}
          className="space-y-4 overflow-hidden h-full relative z-10 custom-scrollbar scroll-smooth"
        >
          {[...messages, ...messages].map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.type === "right" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[75%]">
                <p className="text-[10px] font-semibold text-base-content/40 mb-0.5 px-1">
                  {msg.user}
                </p>

                <div
                  className={`px-4 py-2 text-sm shadow-sm transition-all duration-300 ${
                    msg.type === "right"
                      ? "bg-primary text-primary-content rounded-2xl rounded-tr-sm"
                      : "bg-base-200 text-base-content rounded-2xl rounded-tl-sm border border-base-content/5"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedChatPreview;