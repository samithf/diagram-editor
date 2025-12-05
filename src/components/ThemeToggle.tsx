import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
      className="justify-start p-2"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-6 w-6" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="h-6 w-6" />
          Dark Mode
        </>
      )}
    </Button>
  );
}
