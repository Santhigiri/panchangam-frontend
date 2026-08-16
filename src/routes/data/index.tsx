import { createFileRoute } from '@tanstack/react-router'
import PanchangamDataPage from '@/features/data-admin/components/PanchangamDataPage'

export const Route = createFileRoute('/data/')({
  component: PanchangamDataPage,
})
