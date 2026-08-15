import { createFileRoute } from '@tanstack/react-router'
import StarfinderPage from '@/features/starfinder/components/StarfinderPage'

export const Route = createFileRoute('/starfinder/')({
  component: StarfinderPage,
})
