import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snake Game",
  description: "Classic Snake Game built with Next.js and Valtio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
