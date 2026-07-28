import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tanstackRouter from '@tanstack/router-plugin/vite'
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

const config = defineConfig({
  plugins: [
    devtools(),
    // this is the plugin that enables path aliases.
    // autoCodeSplitting splits each route's component into its own lazy chunk
    // so the home route no longer ships the /calendar and /data feature code.
    tanstackRouter({ autoCodeSplitting: true }),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    viteReact(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: 'classic',
        navigateFallback: 'index.html'
      },
      strategies: 'generateSW',
      workbox: {
        sourcemap: true,
        // Precached index.html served for any navigation the network can't
        // fulfil (offline) — this is what makes the app shell load at all
        // without connectivity. No runtimeCaching override for navigations
        // here: that would take precedence over this fallback and always
        // force a network request, defeating it.
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,ico,png,svg,html,woff,woff2}'],
        globDirectory: 'dist',
        // Without this, an activating SW never takes control of the tab
        // that's already open (only future navigations get controlled) — so
        // testing offline right after the very first visit fails even
        // though the SW installed fine, since it was never actually in the
        // fetch path yet. Safe to combine with registerType: 'prompt' below
        // — this only governs "claim already-open tabs once active", not
        // "when does a new version become active", which RefreshPrompt
        // still gates for real updates.
        clientsClaim: true,
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
      ],

      manifest: {
        name: "Pournami Calendar",
        short_name: "Pournami",
        description: "Malayalam Panchangam Calendar",
        display: "standalone",

        theme_color: "transparent",      // not reliably supported
        background_color: "#00000000",   // transparent RGBA hex
        icons: [
          {
            src: "manifest-icon-192.maskable-preview.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }

    }),
    // Bundle-composition treemap, only when explicitly measuring
    // (ANALYZE=1 npm run build) — never affects normal builds.
    ...(process.env.ANALYZE
      ? [visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true })]
      : []),
  ],
})

export default config
