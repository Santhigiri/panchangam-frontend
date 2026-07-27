import { format } from "date-fns"
import { SortableHeader } from "./SortableHeader"
import type { ColumnDef } from "@tanstack/react-table"
import type { CompactPanchangamData } from "@/api/schemas/compactPanchangamData"

export const panchangamColumns: Array<ColumnDef<CompactPanchangamData>> = [
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader label="Date" column={column} />,
  },
  {
    id: "kollavarsham",
    header: "Kollavarsham",
    accessorFn: (row) => `${row.kv.masa} ${row.kv.kv_day}, ${row.kv.kv_year}`,
  },
  {
    accessorKey: "thithi",
    header: ({ column }) => <SortableHeader label="Thithi" column={column} />,
  },
  {
    accessorKey: "nakshatra",
    header: ({ column }) => <SortableHeader label="Nakshatra" column={column} />,
  },
  {
    accessorKey: "sunrise",
    header: "Sunrise",
    cell: ({ row }) => format(new Date(row.original.sunrise), "HH:mm"),
  },
  {
    accessorKey: "sunset",
    header: "Sunset",
    cell: ({ row }) => format(new Date(row.original.sunset), "HH:mm"),
  },
]
