import type { Nakshatra, NakshatraTransition, Thithi, ThithiTransition } from "@/features/panchangam/schemas/panchangamData"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn, getFormattedDateTime } from "@/lib/utils"

type StarfinderTransitionsTabsProps = {
  thithiTransitions: Array<ThithiTransition>
  currentThithi: Thithi
  nakshatraTransitions: Array<NakshatraTransition>
  currentNakshatra: Nakshatra
}

export default function StarfinderTransitionsTabs({
  thithiTransitions,
  currentThithi,
  nakshatraTransitions,
  currentNakshatra,
}: StarfinderTransitionsTabsProps) {
  return (
    <Card className="rounded-xl py-4">
      <CardContent className="px-4">
        <Tabs defaultValue="thithi">
          <TabsList className="w-full">
            <TabsTrigger value="thithi">Thithi</TabsTrigger>
            <TabsTrigger value="nakshatra">Nakshatra</TabsTrigger>
          </TabsList>

          <TabsContent value="thithi">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thithi</TableHead>
                  <TableHead>Paksha</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {thithiTransitions.map((transition, idx) => (
                  <TableRow
                    key={`thithi-${idx}`}
                    className={cn(transition.thithi.en === currentThithi.en && "bg-primary/10")}
                  >
                    <TableCell className="font-medium">{transition.thithi.en}</TableCell>
                    <TableCell className="text-muted-foreground">{transition.thithi.paksha.en}</TableCell>
                    <TableCell className="text-muted-foreground">{getFormattedDateTime(transition.start_time)}</TableCell>
                    <TableCell className="text-muted-foreground">{getFormattedDateTime(transition.end_time)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="nakshatra">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nakshatra</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nakshatraTransitions.map((transition, idx) => (
                  <TableRow
                    key={`nakshatra-${idx}`}
                    className={cn(transition.nakshatra.en === currentNakshatra.en && "bg-primary/10")}
                  >
                    <TableCell className="font-medium">{transition.nakshatra.en}</TableCell>
                    <TableCell className="text-muted-foreground">{getFormattedDateTime(transition.start_time)}</TableCell>
                    <TableCell className="text-muted-foreground">{getFormattedDateTime(transition.end_time)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
