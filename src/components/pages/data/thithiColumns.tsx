import { SortableHeader } from "./SortableHeader"
import type { ColumnDef } from "@tanstack/react-table"
import type { Thithi } from "@/api/schemas/panchangamData"

export const thithiColumns: Array<ColumnDef<Thithi>> = [
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
  {
    id: "paksha",
    header: ({ column }) => <SortableHeader label="Paksha" column={column} />,
    accessorFn: (row) => row.paksha.en,
  },
]
