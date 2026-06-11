import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 flex items-center justify-center pt-16">
      <div className="w-full max-w-6xl h-[calc(100vh-6.5rem)] px-4 z-10 animate-fade-in-up">
        <div className="glass-panel glass-panel-glow shadow-2xl rounded-2xl h-full overflow-hidden">
          <div className="flex h-full overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;