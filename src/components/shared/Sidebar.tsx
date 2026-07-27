import { Link } from "@tanstack/react-router";
import { Home, Calendar, Menu, X, type LucideIcon } from "lucide-react";
import { useState } from "react";

type NavItemProps = {
  to: string;
  icon: LucideIcon;
  label: string;
};

const navItems: NavItemProps[] = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      {/* ===== DESKTOP SIDEBAR (Fixed Left) ===== */}
      <aside
        className={`
          hidden md:flex md:flex-col fixed left-0 top-0 min-h-screen bg-muted drop-shadow-sm
          text-muted-foreground transition-all duration-300 ease-in-out z-50
          ${isCollapsed ? "w-16" : "w-64"}
        `}
      >
        <div className="p-4 border-b border-amber-700">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-amber-700 hover:text-accent-foreground transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="mt-4">
          {navItems.map(({ to, icon: Icon, label }) => {
            return (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "bg-amber-700 text-accent-foreground" }}
                className={`
                  flex items-center gap-3 px-4 py-3 m-2 rounded-md
                  transition-colors hover:bg-amber-800 hover:text-accent-foreground
                `}
              >
                <Icon size={20} className="min-w-5" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ===== MOBILE BOTTOM NAV (Fixed Bottom) ===== */}
      <nav
        className={`
          md:hidden fixed bottom-0 left-0 right-0 bg-muted drop-shadow-sm
          text-muted-foreground z-50 safe-area-inset-bottom
        `}
      >
        <div className="flex justify-evenly items-stretch py-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            return (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "bg-amber-700 text-accent-foreground" }}
                className={`
                  flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-md
                  transition-colors hover:bg-amber-800
                `}
              >
                <Icon size={20} />
                <span className="text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
