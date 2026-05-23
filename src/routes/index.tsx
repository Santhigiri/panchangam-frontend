import { createFileRoute } from "@tanstack/react-router"
import CalendarCustomDays from "@/components/pages/homepage"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-screen w-full p-6 bg-[#F5F5DC]">
      <div className="w-full flex-1 gap-4">
        <CalendarCustomDays />
      </div >
    </div >
  )
}
