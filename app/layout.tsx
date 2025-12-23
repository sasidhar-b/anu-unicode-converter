import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anu ⇄ Unicode Telugu Converter",
  description: "Offline, static converter for Telugu Unicode and Anu (non-Unicode) text.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
