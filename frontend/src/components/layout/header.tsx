"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 bg-background z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="font-semibold text-lg">Dashboard</h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  );
}
