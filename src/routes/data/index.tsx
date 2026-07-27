import { createFileRoute } from '@tanstack/react-router'
import PanchangamDataPage from '@/components/pages/data/PanchangamDataPage'

export const Route = createFileRoute('/data/')({
  component: PanchangamDataPage,
})
