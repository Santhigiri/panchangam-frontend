import { Card, CardContent } from "@/components/ui/card"
import { useRandomGuruvani } from "@/hooks/useGuruvani"

export default function GuruvaniCard() {
  const { data, isLoading, isError } = useRandomGuruvani()

  return (
    <Card className="border-l-4 border-l-amber-900 rounded-md m-2">
      <CardContent className="flex flex-col gap-1 py-3 px-4">
        <p className="font-semibold text-xs text-[#554336]">GURUVANI</p>
        {isLoading && (
          <p className="font-inter text-xs text-muted-foreground">Loading...</p>
        )}
        {isError && (
          <p className="font-inter text-xs text-muted-foreground">
            Daily words of wisdom will appear here.
          </p>
        )}
        {data && (
          <>
            <p className="font-playfair-display font-medium text-base md:text-lg">
              {data.text_en}
            </p>
            <p className="font-inter text-lg text-muted-foreground">{data.text_ml}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
