import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { TextEffect } from "@/components/ui/text-effect";

interface MarkdownFadeProps {
  content: string;
  className?: string;
}

export const MarkdownFade: React.FC<MarkdownFadeProps> = ({
  content,
  className = "",
}) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [content]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <ReactMarkdown
          className="text-xs md:text-sm prose prose-sm max-w-none"
          components={{
            p: ({ children }) => <p className="">{children}</p>,
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
          {content}
        </ReactMarkdown>
      </motion.div>
    </AnimatePresence>
  );
};

export default MarkdownFade;
