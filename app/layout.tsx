import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { MotionProvider } from "@/providers/MotionProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sky Crawler SP Admin",
  description: "Enterprise Crawler Infrastructure and License Provisioning Portal",
  icons: {
    icon: "/assets/logo/logo.png",
    shortcut: "/assets/logo/logo.png",
    apple: "/assets/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <QueryProvider>
          <ThemeProvider>
            <MotionProvider>
              <AuthProvider>
                {children}
                <Toaster richColors closeButton position="top-right" />
              </AuthProvider>
            </MotionProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
