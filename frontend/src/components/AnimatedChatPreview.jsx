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
    <div className="bg-base-100 rounded-2xl shadow-xl p-6 w-full max-w-md h-[380px] overflow-hidden">
      <div
        ref={containerRef}
        className="space-y-4 overflow-hidden h-full"
      >
        {[...messages, ...messages].map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.type === "right" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs">
              <p className="text-xs text-base-content/60 mb-1">
                {msg.user}
              </p>

              <div
                className={`px-4 py-2 rounded-2xl text-sm ${
                  msg.type === "right"
                    ? "bg-primary text-primary-content"
                    : "bg-base-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedChatPreview;