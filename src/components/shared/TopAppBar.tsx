import type { JSX } from "react"

export type AppBarProps = {
  title: string
  actions?: JSX.Element
}

export default function TopAppBar({ title, actions }: AppBarProps) {
  return (
    <div className="flex flex-row w-full items-end">
      <p className="text-primary ml-8 flex-1 text-center text-xl font-semibold font-playfair-display">{title}</p>
      {actions}
    </div>
  )
}
