import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Document Search",
  description: "AI for searching and summarizing documents",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistMono.variable} antialiased`}
      >
        <nav className="p-4 border-b bg-white">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Smart Document Search</h1>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
