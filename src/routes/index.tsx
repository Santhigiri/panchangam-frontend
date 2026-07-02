import { createFileRoute } from "@tanstack/react-router";
import DayDetailsPage from "@/components/pages/day-details/DayDetailsPage";

export const Route = createFileRoute("/")({ component: App });

function App() {

  return (
    <div className="flex min-h-screen  p-2 bg-[#F5F5DC]">
      <div className="w-full flex-1 gap-4">
        <DayDetailsPage />
      </div>
    </div>
  );
}
