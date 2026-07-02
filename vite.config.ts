import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tanstackRouter from '@tanstack/router-plugin/vite'
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from 'vite-plugin-pwa'

const config = defineConfig({
  plugins: [
    devtools(),
    // this is the plugin that enables path aliases
    tanstackRouter(),
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
        runtimeCaching: [
          {
            urlPattern: /\/$/,  // Matches all HTML navigation requests
            handler: 'NetworkOnly',  // Never caches HTML, always fetches from network
          },
        ],
        globPatterns: ['**/*.{js,css,ico,png,svg}'],
        globDirectory: 'dist'
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

    })
  ],
})

export default config
