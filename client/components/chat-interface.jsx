"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, X,MoveRight } from "lucide-react";
import { IBM_Plex_Mono } from "next/font/google";
import { MarkdownTypewriter } from "react-markdown-typewriter";
import axios from "axios";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextShimmer } from "@/components/ui/text-shimmer";

const IBM = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-IBM",
});

const Chat = ({ uploadedFile, onStartOver }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: `Helow!\n\n Got your document. What would you like to know about it?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ask`,
        {
          question: inputMessage,
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: response.data.answer,
        timestamp: new Date(),
      };

      // Add bot message to the end (bottom) of messages array
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to fetch response:", error);
      const errorMessage = {
        id: Date.now() + 2,
        type: "bot",
        content: "Oops! Something went wrong while processing your question.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex h-screen w-full bg-background ${IBM.className}`}>
      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 p-4 backdrop-blur-xl bg-background">
          <div className="flex items-center gap-2 justify-end text-sm">
            {`Press this cross to close this interface `}
            <MoveRight size={16} />
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartOver}
              className="text-foreground hover:bg-transparent hover:text-foreground"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Chat messages area */}
        <ScrollArea className="flex-1 overflow-y-auto flex flex-col px-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex py-1 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === "user"
                    ? " text-primary ml-auto"
                    : " text-foreground"
                }`}
              >
                <MarkdownTypewriter className="text-lg">
                  {message.content}
                </MarkdownTypewriter>
                <p className="text-xs opacity-70 mt-2">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className=" rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <TextShimmer className="font-mono text-base" duration={1}>
                    Thinking...
                  </TextShimmer>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input area */}
        <div className="border-t bg-primary text-white">
          <div className="flex items-center p-4">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              placeholder="Ask a question about your document..."
              className="flex-1 border-none bg-transparent text-white placeholder:text-white/70 text-lg focus:ring-0 focus:border-none shadow-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
              variant="ghost"
              className="ml-2 h-10 w-10 text-white hover:bg-white/10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
