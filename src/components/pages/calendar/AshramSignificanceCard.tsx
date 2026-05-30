import type { SanthigiriSignificance } from "@/api/schemas/panchangamData"
import { Landmark } from "lucide-react"

export type AshramSignificanceProps = {
  significances: SanthigiriSignificance[]
}


export function AshramSignificance({ significances }: AshramSignificanceProps) {
  return (
    significances.map((significance: SanthigiriSignificance, idx) => (
      <div key={`ashram-significance-${idx}`} className="flex flex-col p-4 gap-2 border-2 border-amber-800 rounded-md m-2">
        <div className="flex flex-row items-start gap-2">
          <Landmark className="w-4 h-4" />
          <p className="text-amber-800 text-[12px] font-bold">ASHRAM SIGNIFICANCE</p>
        </div>
        <p className="font-playfair-display font-bold">{significance.name}</p>
        <p className="font-inter text-xs md:text-sm max-w-full font-light" >{significance.description}</p>
      </div>
    ))
  )
}
