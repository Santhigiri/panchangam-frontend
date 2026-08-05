import { createFileRoute } from '@tanstack/react-router'
import StarfinderPage from '@/components/pages/starfinder/StarfinderPage'

export const Route = createFileRoute('/starfinder/')({
  component: StarfinderPage,
})
