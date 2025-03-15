import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from '@svgr/rollup';
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: 'prompt',
  includeAssests: ['favicon.ico', "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    id: 'com.medalgo.app', // Added app ID
    name: "Medalgo",
    short_name: "Medalgo",
    description: "Brain tumor detection and classification application",
    icons: [{
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'apple touch icon',
    },
    {
      src: '/maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    }
    ],
    theme_color: '#56BB6E',
    background_color: '#FFFFFF', // Changed to hex format
    display: "standalone",
    scope: '/',
    start_url: "/",
    orientation: 'landscape'
  },
  launch_handler: {
    client_mode: ["navigate-existing", "auto"]
  },
  screenshots: [
    {
      src: "/medalgo/1.png",
      sizes: "1280x720",
      type: "image/png",
      form_factor: "wide",
      label: "Homescreen of Medalgo"
    },
    {
      src: "/medalgo/2.png",
      sizes: "1280x720",
      type: "image/png",
      form_factor: "wide",
      label: "Homescreen of Medalgo"
    },
    {
      src: "/medalgo/3.png",
      sizes: "1280x720",
      type: "image/png",
      form_factor: "wide",
      label: "Homescreen of Medalgo"
    },
    {
      src: "/medalgo/4.png",
      sizes: "1280x720",
      type: "image/png",
      form_factor: "wide",
      label: "Homescreen of Medalgo"
    },
    {
      src: "/medalgo/5.png",
      sizes: "1280x720",
      type: "image/png",
      form_factor: "wide",
      label: "Homescreen of Medalgo"
    },
    {
      src: "/medalgo/6.png",
      sizes: "1280x720",
      type: "image/png",
      form_factor: "wide",
      label: "Homescreen of Medalgo"
    },
  ],
  categories: ["medical", "healthcare", "artificial-intelligence"],
  dir: "ltr",
  lang: "en",
  scope_extensions: [
    {
      "origin": "*.medalgo.com"
    }
  ],
  workbox: {
    maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 // Set cache limit to 6 MiB
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), VitePWA(manifestForPlugIn)],
})
