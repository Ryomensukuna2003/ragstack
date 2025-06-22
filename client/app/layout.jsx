import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { IBM_Plex_Mono } from "@next/font/google";

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
const mono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
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
      </body>
    </html>
  );
}
