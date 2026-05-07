import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import CalendarCustomDays from "@/components/pages/homepage"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex h-svh w-full p-6">
      <div className="flex h-full w-full flex-1 gap-4">
        <CalendarCustomDays />
      </div >
    </div >
  )
}
