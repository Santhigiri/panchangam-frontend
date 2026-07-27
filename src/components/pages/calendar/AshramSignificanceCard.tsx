import type { SanthigiriSignificance } from "@/api/schemas/panchangamData"
import { Landmark } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export type AshramSignificanceProps = {
  significances: SanthigiriSignificance[]
}

export function AshramSignificance({ significances }: AshramSignificanceProps) {
  return (
    significances.map((significance, idx) => (
      <Card key={`ashram-significance-${idx}`} className="border-2 border-amber-800 m-2">
        <CardContent className="flex flex-col gap-2 pt-4">
          <div className="flex flex-row items-start gap-2">
            <Landmark className="w-4 h-4 mt-0.5" />
            <p className="text-amber-800 text-[12px] font-bold">ASHRAM SIGNIFICANCE</p>
          </div>
          <p className="font-playfair-display font-bold">{significance.name}</p>
          <p className="font-inter text-xs md:text-sm font-light">{significance.description}</p>
        </CardContent>
      </Card>
    ))
  )
}
