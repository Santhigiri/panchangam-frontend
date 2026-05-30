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
    <div className="md:hidden flex flex-row w-full items-end">
      <p className="text-primary ml-8 flex-1 text-center text-xl font-semibold font-playfair-display">{title}</p>
      {actions}


    </div>
  )
}
