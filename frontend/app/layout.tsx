import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { MotionProvider } from "@/design-system/motion/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "RetailPilot - AI Aesthetic & Styling Platform",
  description: "Merge style aesthetics with AI-powered clothing search and styling recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]" suppressHydrationWarning>
        <ThemeProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
