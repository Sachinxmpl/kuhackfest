import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { UserProvider } from "@/contexts/UserContext";


const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Match",
  description: "A platform to connect students for collaborative learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} antialiased`}
      >
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
