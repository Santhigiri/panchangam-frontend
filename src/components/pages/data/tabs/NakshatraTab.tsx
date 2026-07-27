import { nakshatraColumns } from "../nakshatraColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { useNakshatraReference } from "@/hooks/usePanchangamReference"

export default function NakshatraTab() {
  const { data, isLoading, isError } = useNakshatraReference()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nakshatra</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {isError && (
          <p className="text-sm text-destructive">Failed to load nakshatra data.</p>
        )}
        {data && <DataTable columns={nakshatraColumns} data={data} />}
      </CardContent>
    </Card>
  )
}
