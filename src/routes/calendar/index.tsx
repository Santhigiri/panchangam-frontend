import CalendarCustomDays from '@/components/pages/calendar/calendar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/calendar/')({
  component: CalendarCustomDays,
})

