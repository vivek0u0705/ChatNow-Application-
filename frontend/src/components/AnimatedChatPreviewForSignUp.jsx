import { useEffect, useRef } from "react";

const messages = [
  { from: "vicky", text: "Hey Vivek, are you joining the meeting?" },
  { from: "vivek", text: "Yes, I will join in 5 minutes." },
  { from: "vicky", text: "Okay, sharing the link now." },
  { from: "vivek", text: "Got it. Thanks." },
  { from: "vicky", text: "Let’s discuss the new features." },
  { from: "vivek", text: "Sure, I reviewed them already." },
];

const AnimatedChatPreviewForSignUp = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let scrollAmount = 0;

    const animate = () => {
      if (!container) return;

      scrollAmount += 0.4;

      if (scrollAmount >= container.scrollHeight / 2) {
        scrollAmount = 0;
      }

      container.scrollTop = scrollAmount;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
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
          {[...messages, ...messages].map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.from === "vivek"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="max-w-[75%]">
                <p className="text-[10px] font-semibold text-base-content/40 mb-0.5 px-1">
                  {msg.from === "vivek" ? "Vivek" : "Vicky"}
                </p>
                <div
                  className={`px-4 py-2 text-sm shadow-sm transition-all duration-300 ${
                    msg.from === "vivek"
                      ? "bg-primary text-primary-content rounded-2xl rounded-tr-sm"
                      : "bg-base-100 text-base-content rounded-2xl rounded-tl-sm border border-base-content/5"
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

export default AnimatedChatPreviewForSignUp;