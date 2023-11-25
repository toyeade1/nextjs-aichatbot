import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toye's Notes App",
  description: "The intelligent note taking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* We will wrap the body contents inside of the themeprovider for dark mode */}
          <ThemeProvider
          attribute="class">
          {children}
          </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
