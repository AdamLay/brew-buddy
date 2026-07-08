import { BatchCalendar } from "@/components/batch/BatchCalendar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  return <BatchCalendar />;
}
