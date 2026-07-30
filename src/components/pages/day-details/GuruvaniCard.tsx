import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { useRandomGuruvani } from "@/hooks/useGuruvani"
import { cn } from "@/lib/utils"

export default function GuruvaniCard() {
  const { data, isLoading, isError } = useRandomGuruvani()
  const [open, setOpen] = useState(false)

  return (
    <Card className="border-l-4 border-l-primary rounded-md py-3">
      <CardContent className="flex flex-col gap-1 px-4">
        <p className="font-semibold text-xs text-muted-foreground">GURUVANI</p>
        {isLoading && (
          <p className="font-inter text-xs text-muted-foreground">Loading...</p>
        )}
        {isError && (
          <p className="font-inter text-xs text-muted-foreground">
            Daily words of wisdom will appear here.
          </p>
        )}
        {data && (
          <Collapsible open={open} onOpenChange={setOpen}>
            <p className="font-playfair-display font-medium text-base md:text-lg">
              {data.text_en}
            </p>
            <CollapsibleContent className="flex flex-col gap-2 pt-2">
              <Separator />
              <p className="font-inter text-lg text-muted-foreground">{data.text_ml}</p>
            </CollapsibleContent>
            <CollapsibleTrigger className="mt-1 flex items-center gap-1 self-start font-inter text-xs font-medium text-primary">
              {open ? "Show less" : "Read full · മലയാളം"}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}
