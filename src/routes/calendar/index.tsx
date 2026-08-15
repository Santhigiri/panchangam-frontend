import { createFileRoute } from '@tanstack/react-router'
import CalendarCustomDays from '@/features/calendar/components/calendar'

export const Route = createFileRoute('/calendar/')({
  component: CalendarCustomDays,
})

