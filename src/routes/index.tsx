import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react"; // <-- Add this import
import CalendarCustomDays from "@/components/pages/homepage";

export const Route = createFileRoute("/")({ component: App });

function App() {

  return (
    <div className="flex min-h-screen w-full p-2 bg-[#F5F5DC]">
      <div className="w-full flex-1 gap-4">
        <CalendarCustomDays />
      </div>
    </div>
  );
}
