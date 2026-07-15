import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "ML Experiment Tracker",
  description: "Track and compare machine learning experiments efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen font-sans">
        <Providers attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 p-6 overflow-auto bg-muted/20">
                {children}
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
