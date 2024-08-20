import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { cn } from "@/lib/utils";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Citizen Wallet Community Server",
  description: "Dashboard for your community token",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Theme accentColor="purple" grayColor="sand" radius="large">
          {children}
          <Toaster />
        </Theme>
      </body>
    </html>
  );
}
