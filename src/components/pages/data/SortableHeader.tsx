import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SortableHeader({
  label,
  column,
}: {
  label: string
  column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" }
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown />
    </Button>
  )
}
