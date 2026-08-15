import { createFileRoute } from "@tanstack/react-router";
import DayDetailsPage from "@/features/day-details/components/DayDetailsPage";

export const Route = createFileRoute("/")({ component: App });

function App() {

  return (
    <div className="flex bg-card">
      <div className="w-full">
        <DayDetailsPage />
      </div>
    </div>
  );
}
