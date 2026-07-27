import { thithiColumns } from "../thithiColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { useThithiReference } from "@/hooks/usePanchangamReference"

export default function ThithiTab() {
  const { data, isLoading, isError } = useThithiReference()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thithi</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {isError && (
          <p className="text-sm text-destructive">Failed to load thithi data.</p>
        )}
        {data && <DataTable columns={thithiColumns} data={data} />}
      </CardContent>
    </Card>
  )
}
