import { Card, CardContent } from "@/components/ui/card"

export default function GuruvaniCard() {
  return (
    <Card className="border-l-4 border-l-amber-900 rounded-md m-2">
      <CardContent className="flex flex-col gap-1 py-3 px-4">
        <p className="font-semibold text-xs text-[#554336]">GURUVANI</p>
        <p className="font-playfair-display font-medium text-base md:text-lg">Coming soon</p>
        <p className="font-inter text-xs text-muted-foreground">Daily words of wisdom will appear here.</p>
      </CardContent>
    </Card>
  )
}
