import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/10 backdrop-blur-sm relative overflow-hidden">
      <div className="max-w-md text-center space-y-6 relative z-10 animate-fade-in-up">
        {/* Animated Badge Container */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            {/* Outer soft pulsing ring */}
            <div className="absolute inset-0 rounded-3xl bg-primary/10 opacity-25 blur-lg animate-pulse animate-pulse"></div>
            
            <div className="relative w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-105">
              <MessageSquare className="w-9 h-9 text-primary animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>

        {/* Welcome Details */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome to ChatNow!
          </h2>
          <p className="text-base-content/60 text-sm max-w-sm mx-auto leading-relaxed">
            Select a conversation from the sidebar list to start exchanging messages, sharing photos, and staying in touch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected; 