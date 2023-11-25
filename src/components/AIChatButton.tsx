import { useState } from "react";
import AIChatBox from "./AiChatBox";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

export default function AIChatButton() {
  const [chatboxOpen, setChatBoxOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2" />
        AI Chat
      </Button>
      <AIChatBox open={chatboxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
