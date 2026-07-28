import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  showLabel: boolean;
};

export default function ThemeToggle({ showLabel }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
          flex w-full items-center justify-start gap-3 appearance-none px-4 py-3 rounded-md
          transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
        `}
    >
      {isDark ? <Moon size={20} className="min-w-5" /> : <Sun size={20} className="min-w-5" />}
      {showLabel && <span className="truncate">{isDark ? "Dark mode" : "Light mode"}</span>}
    </button>
  );
}
