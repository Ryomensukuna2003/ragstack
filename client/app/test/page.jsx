"use client";
import { useState, useRef, useEffect } from "react";
import { Send, X,MoveRight } from "lucide-react";
import { IBM_Plex_Mono } from "next/font/google";
import { MarkdownTypewriter } from "react-markdown-typewriter";
import axios from "axios";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { RotatingText } from "@/components/ui/rotatingText";

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
      content: `Hi!\n\n I've analyzed your ${
        uploadedFile?.name?.includes("YouTube") ? "YouTube video" : "document"
      } "${uploadedFile?.name}". What would you like to know about it?`,
      timestamp: new Date(),
    },
    {
      id: 2,
      type: "bot",
      content:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus animi sit necessitatibus eveniet voluptatum minus. Quas, fugit neque omnis mollitia, saepe at animi aliquid et distinctio deserunt unde rem sit corrupti amet repellendus velit libero tempore recusandae excepturi suscipit natus. Sapiente inventore magni saepe a omnis deleniti aliquid est, ipsum sint nihil neque blanditiis reprehenderit dolorum voluptate! Eligendi cum quis doloribus perferendis. Ex quas optio eveniet inventore quam animi, quod magnam facere natus ea officiis corporis odit accusamus magni nostrum commodi adipisci quia perferendis consequuntur eaque fuga! Facilis, doloribus perspiciatis! Quis, ea fugiat nobis assumenda expedita excepturi consequatur quasi corporis quidem aliquid error perferendis pariatur saepe sint distinctio eum doloremque perspiciatis dolore commodi eligendi doloribus quam. Temporibus ducimus explicabo autem suscipit laudantium tempore consequuntur incidunt harum, facilis, voluptas totam mollitia cum aut necessitatibus porro commodi quaerat reprehenderit ratione quasi qui repellat, culpa eaque magnam! Aut quod labore ipsam praesentium cum cupiditate blanditiis culpa fugit at sunt, exercitationem, omnis velit sint. Recusandae hic, quia necessitatibus numquam at nemo, harum eius deleniti officia molestias soluta eos possimus quos? Voluptatum dignissimos eum laboriosam, animi explicabo hic architecto necessitatibus excepturi perferendis quia itaque inventore, non nisi quae eaque dolorem aut accusamus eligendi! Cupiditate officia vero harum qui, numquam esse animi cumque quo eos a distinctio soluta, quaerat ullam nulla nisi totam sed eum delectus mollitia quibusdam, ducimus libero. Quasi dolorum amet voluptate, veniam quis odio incidunt in repellendus impedit, vel sint, voluptatum non! Recusandae, mollitia? Harum minus sunt consequuntur hic tempora veniam porro veritatis error, nemo autem, eos perspiciatis ratione maxime odit? Vero illo sit dolores dolorem fuga deserunt maiores sint similique doloribus consequatur distinctio ut fugiat eaque debitis vitae soluta dolore repellat, nam rerum facilis non laborum. Saepe tempora perferendis sit corporis repellendus nam et neque quasi facere quas nobis dignissimos, ex eligendi culpa totam, excepturi, iste ipsam itaque autem inventore deserunt. Perferendis ipsum ad recusandae sit! Labore maiores nesciunt nihil delectus nulla, quod tempore reprehenderit incidunt numquam deserunt molestias quos odio cumque dolor quae cum eveniet facilis veritatis! Illum voluptatum laborum possimus nihil corporis amet obcaecati? Quia architecto vitae expedita. Ab obcaecati illum neque velit. Facilis veniam maiores pariatur blanditiis eum beatae velit neque eos ea error illum, quo eveniet praesentium voluptates, voluptatibus animi numquam repellendus nemo itaque dolorem earum cumque dolores et sequi. Repellendus dolore soluta eos alias dolores a totam cum similique? Illo iste animi obcaecati quas natus eum atque.",
      timestamp: new Date(),
    },
    {
      id: 3,
      type: "user",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe ea, natus harum repudiandae veritatis officia, ipsam, quibusdam illo incidunt laudantium temporibus quod similique accusamus. Provident, animi asperiores. Doloremque suscipit excepturi voluptatum totam laboriosam modi ut quae rerum laborum beatae repellendus quasi cumque molestias, possimus et quo optio? Odit, blanditiis sed rerum neque asperiores voluptatem alias quis, inventore autem amet dolor a, voluptatibus pariatur doloremque fugit explicabo officia architecto accusantium. Cum unde officia delectus sequi! Libero adipisci, similique, nemo animi odit ex voluptatum ab quo corporis nostrum maxime aspernatur, quas vel sed alias suscipit magni voluptas natus odio quibusdam! Ipsa, adipisci?",
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
      <div className="flex flex-col h-full w-full relative">
        {/* Chat messages area - full height */}
        <ScrollArea className="h-full overflow-y-auto flex flex-col px-4 pt-20 pb-20">
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
              <div className="bg-muted rounded-lg px-4 py-2">
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

        {/* Sticky Header - positioned absolutely */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md backdrop-saturate-150 border-b border-border/40" style={{backdropFilter: 'blur(12px) saturate(150%)'}}>
          <div className="flex items-center gap-2 justify-end text-sm">
            {`Press this cross to close this interface `}<MoveRight size={16} /> 
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartOver}
              className="text-foreground hover:bg-transparent hover:text-foreground"
            >
                <X size={16}/>
            </Button>
          </div>
        </div>

        {/* Input area - positioned absolutely */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-primary text-white">
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
