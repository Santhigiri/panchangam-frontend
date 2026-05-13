import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tanstackRouter from '@tanstack/router-plugin/vite'
import tailwindcss from "@tailwindcss/vite"

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
  ],
})

export default config
