import { Link, useNavigate } from "@tanstack/react-router";
import { Home, Calendar, Database, Menu, X, type LucideIcon, User, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { LoginDialog } from "@/components/shared/LoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { useMobileSidebar } from "@/hooks/useMobileSidebar";

type NavItemProps = {
  to: string;
  icon: LucideIcon;
  label: string;
};

const baseNavItems: Array<NavItemProps> = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
];

const adminNavItems: Array<NavItemProps> = [
  { to: "/data", icon: Database, label: "Data" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated, username, role, logout } = useAuth();
  const { isMobileMenuOpen, closeMobileMenu } = useMobileSidebar();
  const navigate = useNavigate();
  const navItems = role === "admin" ? [...baseNavItems, ...adminNavItems] : baseNavItems;
  const showLabels = !isCollapsed || isMobileMenuOpen;

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <>
      {/* Backdrop behind the mobile drawer — tap to dismiss */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* ===== SIDEBAR (Fixed Left, all breakpoints) =====
          Mobile: hidden (w-0) until opened via the TopAppBar hamburger, then a w-64 drawer that
          stops above the bottom nav (bottom-16) so the two never overlap and the login button
          at the bottom of the drawer stays fully visible.
          Desktop (md+): full height (bottom-0), toggled between icon-only (w-16) and labeled (w-64). */}
      <aside
        className={`
          flex flex-col fixed left-0 top-0 bottom-16 md:bottom-0 bg-muted drop-shadow-sm
          text-muted-foreground transition-all duration-300 ease-in-out z-50 overflow-hidden
          ${isMobileMenuOpen ? "w-64" : "w-0"}
          ${isCollapsed ? "md:w-16" : "md:w-64"}
          md:overflow-visible
        `}
      >
        <div className="p-4 border-b border-amber-700 flex items-center justify-between">
          {/* Desktop icon-only/labeled toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:inline-flex appearance-none p-2 rounded-md hover:bg-amber-700 hover:text-accent-foreground transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          {/* Mobile drawer close button */}
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="md:hidden appearance-none p-2 rounded-md hover:bg-amber-700 hover:text-accent-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4">
          {navItems.map(({ to, icon: Icon, label }) => {
            return (
              <Link
                key={to}
                to={to}
                onClick={closeMobileMenu}
                activeProps={{ className: "bg-amber-700 text-accent-foreground" }}
                className={`
                  flex items-center gap-3 px-4 py-3 m-2 rounded-md
                  transition-colors hover:bg-amber-800 hover:text-accent-foreground
                `}
              >
                <Icon size={20} className="min-w-5" />
                {showLabels && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="w-full mt-auto p-2 border-t border-amber-700">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`
                  flex w-full items-center justify-start gap-3 appearance-none px-4 py-3 rounded-md
                  transition-colors hover:bg-amber-800 hover:text-accent-foreground
                `}
            >
              <LogOutIcon size={20} className="min-w-5" />
              {showLabels && <span className="truncate">Log out ({username})</span>}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className={`
                  flex w-full items-center justify-start gap-3 appearance-none px-4 py-3 rounded-md
                  transition-colors hover:bg-amber-800 hover:text-accent-foreground
                `}
            >
              <User size={20} className="min-w-5" />
              {showLabels && <span className="truncate">Log in</span>}
            </button>
          )}
        </div>
      </aside>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />

      {/* ===== MOBILE BOTTOM NAV (Fixed Bottom, mobile-only, in addition to the sidebar) =====
          Fixed h-16 so the sidebar drawer's bottom-16 offset lines up exactly, with no gap or overlap. */}
      <nav
        className={`
          md:hidden fixed bottom-0 left-0 right-0 h-16 bg-muted drop-shadow-sm
          text-muted-foreground z-50 safe-area-inset-bottom
        `}
      >
        <div className="flex h-full justify-evenly items-center py-2">
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
