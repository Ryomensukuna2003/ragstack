import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";


const geistMono = Geist_Mono({
  // variable: "--font-geist-mono",
  weight: "400",
  subsets: ["latin"],
});

const geist = Geist({
  // variable: "--font-geist",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});


export const metadata = {
  title: "Smart Document Search",
  description: "AI for searching and summarizing documents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistMono.className} antialiased `}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
