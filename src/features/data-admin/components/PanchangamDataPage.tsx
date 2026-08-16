import GuruvaniTab from "./tabs/GuruvaniTab"
import NakshatraTab from "./tabs/NakshatraTab"
import PanchangamTab from "./tabs/PanchangamTab"
import SanthigiriEventsTab from "./tabs/SanthigiriEventsTab"
import ThithiTab from "./tabs/ThithiTab"
import TopAppBar from "@/components/shared/TopAppBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TABS = [
  { value: "panchangam", label: "Panchangam" },
  { value: "nakshatra", label: "Nakshatra" },
  { value: "thithi", label: "Thithi" },
  { value: "santhigiri-events", label: "Santhigiri Events" },
  { value: "guruvanis", label: "Guruvanis" },
]

export default function PanchangamDataPage() {
  return (
    <div className="flex flex-col items-stretch">
      <TopAppBar title="Panchangam Data" />

      <Tabs defaultValue="panchangam" className="p-2">
        <TabsList>
          {TABS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="panchangam">
          <PanchangamTab />
        </TabsContent>
        <TabsContent value="nakshatra">
          <NakshatraTab />
        </TabsContent>
        <TabsContent value="thithi">
          <ThithiTab />
        </TabsContent>
        <TabsContent value="santhigiri-events">
          <SanthigiriEventsTab />
        </TabsContent>
        <TabsContent value="guruvanis">
          <GuruvaniTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
