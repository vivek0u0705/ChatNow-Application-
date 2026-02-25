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
    <div className="w-[420px] h-[500px] bg-base-200 rounded-3xl shadow-xl overflow-hidden border border-base-300">
      <div
        ref={containerRef}
        className="h-full overflow-hidden p-6 space-y-4"
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
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                msg.from === "vivek"
                  ? "bg-primary text-primary-content"
                  : "bg-base-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedChatPreviewForSignUp;