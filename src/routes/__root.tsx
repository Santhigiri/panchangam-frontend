import { HeadContent, createRootRoute, Outlet } from "@tanstack/react-router"
import appCss from "../styles.css?url"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"
import { RefreshPrompt } from "@/components/shared/RefreshPrompt"
import Sidebar from "@/components/shared/Sidebar"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Pournami Calendar",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <div className="flex flex-col-reverse md:flex-row min-h-screen w-full bg-[#F5F5DC]">
        <Sidebar />
        <main className="flex-1 overflow-auto p-2 md:ml-16">
          <Outlet /> {/* Child routes render here */}
        </main>
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      {children}
      <RefreshPrompt />
    </QueryClientProvider>
  )
}
