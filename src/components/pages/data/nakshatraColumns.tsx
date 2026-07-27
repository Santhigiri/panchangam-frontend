import { SortableHeader } from "./SortableHeader"
import type { ColumnDef } from "@tanstack/react-table"
import type { Nakshatra } from "@/api/schemas/panchangamData"

export const nakshatraColumns: Array<ColumnDef<Nakshatra>> = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader label="ID" column={column} />,
  },
  {
    accessorKey: "en",
    header: ({ column }) => <SortableHeader label="Name" column={column} />,
  },
  {
    accessorKey: "ml",
    header: "Malayalam",
  },
]
