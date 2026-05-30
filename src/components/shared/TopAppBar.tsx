import type { JSX, ReactNode } from "react"

export type AppBarProps = {
  title: string
  showSidbar?: boolean,
  actions?: JSX.Element
}

export default function TopAppBar(
  { title, showSidbar = false, actions }: AppBarProps
) {
  return (
    <div className="md:hidden flex flex-row">
      <p className="text-primary-foreground font-inter">{title}</p>
      {actions}


    </div>
  )
}
