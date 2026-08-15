import { SortableHeader } from "./SortableHeader"
import type { ColumnDef } from "@tanstack/react-table"
import type { CompactPanchangamData } from "@/features/panchangam/schemas/compactPanchangamData"
import { APP_TIMEZONE } from "@/lib/constants"
import { getFormattedTime } from "@/lib/utils"

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
    cell: ({ row }) => getFormattedTime(row.original.sunrise, APP_TIMEZONE),
  },
  {
    accessorKey: "sunset",
    header: "Sunset",
    cell: ({ row }) => getFormattedTime(row.original.sunset, APP_TIMEZONE),
  },
]
