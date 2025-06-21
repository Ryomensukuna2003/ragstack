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
      const response = await axios.post("http://localhost:3001/api/ask", {
        question: inputMessage,
      });

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
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">{uploadedFile?.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile?.size / 1024 / 1024).toFixed(2)} MB • Ready for
                  questions
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onStartOver} size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Upload New File
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="flex flex-col h-[600px]">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-lg">Chat with your document</CardTitle>
          <Separator />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
            <div className="space-y-4 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 w-full ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>
                      {message.type === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col min-w-0 max-w-[calc(100%-3rem)] ${
                      message.type === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 break-words ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3 w-full">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4 flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question about your document..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}