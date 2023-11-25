import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, Trash, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat(); // automatically in next apps it will make a request to the /api/chat endpoint

  // refs allow us to access html elements directy
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  //creating effects for what to do for the scrolling
  useEffect(() => {
    if (scrollRef.current) {
      // checking to see if the scrolref has a current value and if it does it is setting the scrolltop to the current height
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  //creating another one for the input
  useEffect(() => {
    //checks to see if the chatbot is open
    if (open) {
      inputRef.current?.focus();
    }
  });

  // we will use the isloading property form openai so that while it is getting the message it shows a loading screen to help the user understand the

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Something went wrong, Please try again",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <ChatMessage
            message={{
                role: "assistant",
                content: "Hi, I am TboyAI, your note taking AI. Ask me anything"
            }}
            />
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Button
            title="Clear Chat"
            variant="outline"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say Something...."
            ref={inputRef}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  // here we are accessing the current user info from clerk
  const { user } = useUser();

  // we will now define a boolean for to see if the current message is comming from the user or the assistant
  const isAIAssistant: Boolean = role === "assistant";

  // we use cn to be able to use conditional statements to incluce CSS styles
  // we are checking to see if it is an ai assistant role and if it is we are putting it on the left side
  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAIAssistant ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {/* checking to see if it is an AI message and if it is we will use the bot as the image */}
      {isAIAssistant && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-1",
          isAIAssistant
            ? "bg-background"
            : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>
      {!isAIAssistant && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="user-image"
          width={40}
          height={40}
          className="ml-2 rounded-full"
        />
      )}
    </div>
  );
}
