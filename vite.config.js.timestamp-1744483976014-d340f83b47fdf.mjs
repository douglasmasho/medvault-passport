// vite.config.js
import { defineConfig } from "file:///C:/Users/Douglas%20Masho/Documents/medvault/medvault-passport/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Douglas%20Masho/Documents/medvault/medvault-passport/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///C:/Users/Douglas%20Masho/Documents/medvault/medvault-passport/node_modules/@svgr/rollup/dist/index.js";
import { VitePWA } from "file:///C:/Users/Douglas%20Masho/Documents/medvault/medvault-passport/node_modules/vite-plugin-pwa/dist/index.js";
var manifestForPlugIn = {
  registerType: "prompt",
  includeAssests: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    id: "com.medalgo.app",
    // Added app ID
    name: "Medalgo",
    short_name: "Medalgo",
    description: "Brain tumor detection and classification application",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon"
      },
      {
        src: "/maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    theme_color: "#56BB6E",
    background_color: "#FFFFFF",
    // Changed to hex format
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "landscape"
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
    }
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
    maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
    // Set cache limit to 6 MiB
  }
};
var vite_config_default = defineConfig({
  plugins: [react(), svgr(), VitePWA(manifestForPlugIn)]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEb3VnbGFzIE1hc2hvXFxcXERvY3VtZW50c1xcXFxtZWR2YXVsdFxcXFxtZWR2YXVsdC1wYXNzcG9ydFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcRG91Z2xhcyBNYXNob1xcXFxEb2N1bWVudHNcXFxcbWVkdmF1bHRcXFxcbWVkdmF1bHQtcGFzc3BvcnRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0RvdWdsYXMlMjBNYXNoby9Eb2N1bWVudHMvbWVkdmF1bHQvbWVkdmF1bHQtcGFzc3BvcnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcbmltcG9ydCBzdmdyIGZyb20gJ0BzdmdyL3JvbGx1cCc7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XHJcblxyXG5jb25zdCBtYW5pZmVzdEZvclBsdWdJbiA9IHtcclxuICByZWdpc3RlclR5cGU6ICdwcm9tcHQnLFxyXG4gIGluY2x1ZGVBc3Nlc3RzOiBbJ2Zhdmljb24uaWNvJywgXCJhcHBsZS10b3VjaC1pY29uLnBuZ1wiLCBcIm1hc2tlZC1pY29uLnN2Z1wiXSxcclxuICBtYW5pZmVzdDoge1xyXG4gICAgaWQ6ICdjb20ubWVkYWxnby5hcHAnLCAvLyBBZGRlZCBhcHAgSURcclxuICAgIG5hbWU6IFwiTWVkYWxnb1wiLFxyXG4gICAgc2hvcnRfbmFtZTogXCJNZWRhbGdvXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJCcmFpbiB0dW1vciBkZXRlY3Rpb24gYW5kIGNsYXNzaWZpY2F0aW9uIGFwcGxpY2F0aW9uXCIsXHJcbiAgICBpY29uczogW3tcclxuICAgICAgc3JjOiAnL2FuZHJvaWQtY2hyb21lLTE5MngxOTIucG5nJyxcclxuICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcclxuICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgIHB1cnBvc2U6ICdhbnknXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzcmM6ICcvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmcnLFxyXG4gICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgcHVycG9zZTogJ2FueSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHNyYzogJy9hcHBsZS10b3VjaC1pY29uLnBuZycsXHJcbiAgICAgIHNpemVzOiAnMTgweDE4MCcsXHJcbiAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICBwdXJwb3NlOiAnYXBwbGUgdG91Y2ggaWNvbicsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzcmM6ICcvbWFza2FibGUucG5nJyxcclxuICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcclxuICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgIHB1cnBvc2U6ICdhbnkgbWFza2FibGUnLFxyXG4gICAgfVxyXG4gICAgXSxcclxuICAgIHRoZW1lX2NvbG9yOiAnIzU2QkI2RScsXHJcbiAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI0ZGRkZGRicsIC8vIENoYW5nZWQgdG8gaGV4IGZvcm1hdFxyXG4gICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXHJcbiAgICBzY29wZTogJy8nLFxyXG4gICAgc3RhcnRfdXJsOiBcIi9cIixcclxuICAgIG9yaWVudGF0aW9uOiAnbGFuZHNjYXBlJ1xyXG4gIH0sXHJcbiAgbGF1bmNoX2hhbmRsZXI6IHtcclxuICAgIGNsaWVudF9tb2RlOiBbXCJuYXZpZ2F0ZS1leGlzdGluZ1wiLCBcImF1dG9cIl1cclxuICB9LFxyXG4gIHNjcmVlbnNob3RzOiBbXHJcbiAgICB7XHJcbiAgICAgIHNyYzogXCIvbWVkYWxnby8xLnBuZ1wiLFxyXG4gICAgICBzaXplczogXCIxMjgweDcyMFwiLFxyXG4gICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICBmb3JtX2ZhY3RvcjogXCJ3aWRlXCIsXHJcbiAgICAgIGxhYmVsOiBcIkhvbWVzY3JlZW4gb2YgTWVkYWxnb1wiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzcmM6IFwiL21lZGFsZ28vMi5wbmdcIixcclxuICAgICAgc2l6ZXM6IFwiMTI4MHg3MjBcIixcclxuICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgZm9ybV9mYWN0b3I6IFwid2lkZVwiLFxyXG4gICAgICBsYWJlbDogXCJIb21lc2NyZWVuIG9mIE1lZGFsZ29cIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOiBcIi9tZWRhbGdvLzMucG5nXCIsXHJcbiAgICAgIHNpemVzOiBcIjEyODB4NzIwXCIsXHJcbiAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgIGZvcm1fZmFjdG9yOiBcIndpZGVcIixcclxuICAgICAgbGFiZWw6IFwiSG9tZXNjcmVlbiBvZiBNZWRhbGdvXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHNyYzogXCIvbWVkYWxnby80LnBuZ1wiLFxyXG4gICAgICBzaXplczogXCIxMjgweDcyMFwiLFxyXG4gICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICBmb3JtX2ZhY3RvcjogXCJ3aWRlXCIsXHJcbiAgICAgIGxhYmVsOiBcIkhvbWVzY3JlZW4gb2YgTWVkYWxnb1wiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzcmM6IFwiL21lZGFsZ28vNS5wbmdcIixcclxuICAgICAgc2l6ZXM6IFwiMTI4MHg3MjBcIixcclxuICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgZm9ybV9mYWN0b3I6IFwid2lkZVwiLFxyXG4gICAgICBsYWJlbDogXCJIb21lc2NyZWVuIG9mIE1lZGFsZ29cIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOiBcIi9tZWRhbGdvLzYucG5nXCIsXHJcbiAgICAgIHNpemVzOiBcIjEyODB4NzIwXCIsXHJcbiAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgIGZvcm1fZmFjdG9yOiBcIndpZGVcIixcclxuICAgICAgbGFiZWw6IFwiSG9tZXNjcmVlbiBvZiBNZWRhbGdvXCJcclxuICAgIH0sXHJcbiAgXSxcclxuICBjYXRlZ29yaWVzOiBbXCJtZWRpY2FsXCIsIFwiaGVhbHRoY2FyZVwiLCBcImFydGlmaWNpYWwtaW50ZWxsaWdlbmNlXCJdLFxyXG4gIGRpcjogXCJsdHJcIixcclxuICBsYW5nOiBcImVuXCIsXHJcbiAgc2NvcGVfZXh0ZW5zaW9uczogW1xyXG4gICAge1xyXG4gICAgICBcIm9yaWdpblwiOiBcIioubWVkYWxnby5jb21cIlxyXG4gICAgfVxyXG4gIF0sXHJcbiAgd29ya2JveDoge1xyXG4gICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDYgKiAxMDI0ICogMTAyNCAvLyBTZXQgY2FjaGUgbGltaXQgdG8gNiBNaUJcclxuICB9XHJcbn1cclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksIHN2Z3IoKSwgVml0ZVBXQShtYW5pZmVzdEZvclBsdWdJbildLFxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlYLFNBQVMsb0JBQW9CO0FBQzlZLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxlQUFlO0FBRXhCLElBQU0sb0JBQW9CO0FBQUEsRUFDeEIsY0FBYztBQUFBLEVB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
