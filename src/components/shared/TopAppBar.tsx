import { Menu } from "lucide-react"
import type { JSX } from "react"
import { Button } from "@/components/ui/button"
import { useMobileSidebar } from "@/hooks/useMobileSidebar"

export type AppBarProps = {
  title: string
  actions?: JSX.Element
}

export default function TopAppBar({ title, actions }: AppBarProps) {
  const { openMobileMenu } = useMobileSidebar()

  return (
    <>
      {/* position: fixed (not sticky) — sticky lives inside main's scrolling
          box and visually bounces along with iOS's rubber-band overscroll.
          fixed is anchored to the viewport, so it's unaffected by that. It
          matches main's md:ml-16 sidebar offset via md:left-16. */}
      <div className="fixed top-0 left-0 right-0 md:left-16 z-30 flex h-14 flex-row items-center bg-[#F5F5DC] px-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="md:hidden"
          onClick={openMobileMenu}
        >
          <Menu />
        </Button>
        <p className="text-primary flex-1 text-center align-top text-xl font-semibold font-playfair-display">{title}</p>
        {actions}
      </div>
      {/* Spacer reserving the fixed bar's height so content isn't hidden under it */}
      <div className="h-14" aria-hidden="true" />
    </>
  )
}
