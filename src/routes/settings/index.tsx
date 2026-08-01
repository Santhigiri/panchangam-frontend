import { createFileRoute } from '@tanstack/react-router'
import SettingsPage from '@/components/pages/settings/SettingsPage'

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
})
