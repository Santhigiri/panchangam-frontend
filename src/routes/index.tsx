import { createFileRoute } from "@tanstack/react-router";
import DayDetailsPage from "@/components/pages/day-details/DayDetailsPage";

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
