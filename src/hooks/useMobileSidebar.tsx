import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

type MobileSidebarContextValue = {
  isMobileMenuOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void
}

const MobileSidebarContext = createContext<MobileSidebarContextValue | null>(null)

export function MobileSidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <MobileSidebarContext.Provider
      value={{
        isMobileMenuOpen,
        openMobileMenu: () => setIsMobileMenuOpen(true),
        closeMobileMenu: () => setIsMobileMenuOpen(false),
      }}
    >
      {children}
    </MobileSidebarContext.Provider>
  )
}

export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext)
  if (!context) {
    throw new Error("useMobileSidebar must be used within a MobileSidebarProvider")
  }
  return context
}
