"use client"

import { useState, useRef, useEffect } from "react"
import { Send, FileText, RotateCcw, User, Bot } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function ChatInterface({ uploadedFile, onStartOver }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: `Hi! I've analyzed your document "${uploadedFile?.name}". What would you like to know about it?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

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
        "https://2659-20-244-83-191.ngrok-free.app/api/ask",
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
    <div className="w-full h-full max-w-full">
      <Card className="flex flex-col w-full h-screen max-w-full border-0 rounded-none">
        <Card className="rounded-none shadow-none py-0">
          <CardHeader className="px-3 md:p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm md:text-lg truncate">
                    {uploadedFile?.name}
                  </CardTitle>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {(uploadedFile?.size / 1024 / 1024).toFixed(2)} MB • Ready
                    for questions
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={onStartOver}
                size="sm"
                className="text-xs md:text-sm flex-shrink-0"
              >
                <RotateCcw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Upload New File</span>
                <span className="sm:hidden">New File</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Separator />
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
            <div className="space-y-3 md:space-y-4 p-2 md:p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 md:space-x-3 w-full ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                    <AvatarFallback>
                      {message.type === "user" ? (
                        <User className="h-3 w-3 md:h-4 md:w-4" />
                      ) : (
                        <Bot className="h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col min-w-0 max-w-[calc(100%-2.5rem)] md:max-w-[calc(100%-3rem)] ${
                      message.type === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-2 py-1.5 md:px-4 md:py-2 break-words ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <ReactMarkdown
                        className="text-xs md:text-sm prose prose-sm max-w-none"
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 md:mb-5">{children}</p>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-100 px-1 rounded text-xs md:text-sm">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-gray-100 p-1.5 md:p-2 rounded overflow-x-auto text-xs md:text-sm">
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-2 md:space-x-3 w-full">
                  <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                    <AvatarFallback>
                      <Bot className="h-3 w-3 md:h-4 md:w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-2 py-1.5 md:px-4 md:py-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 md:w-2 md:h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 md:w-2 md:h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t px-2 md:px-4 pt-2 md:pt-4 pb-2 md:pb-0 flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question about your document..."
                disabled={isLoading}
                className="flex-1 text-xs md:text-base"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="flex-shrink-0 h-9 w-9 md:h-10 md:w-10"
              >
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
            <p className="flex items-center justify-end text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2">
              <span className="hidden sm:inline">
                Press Enter to send, Shift + Enter for new line
              </span>
              <span className="sm:hidden">Enter to send</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}