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
    <div className="flex flex-row w-full items-center">
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
  )
}
