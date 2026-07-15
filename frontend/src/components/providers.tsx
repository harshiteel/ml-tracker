"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextThemesProvider {...props}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
