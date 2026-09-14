// vite.config.js
import { defineConfig } from "file:///C:/Users/DouglasMashonganyika/Documents/GitHub/medvault-passport/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/DouglasMashonganyika/Documents/GitHub/medvault-passport/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///C:/Users/DouglasMashonganyika/Documents/GitHub/medvault-passport/node_modules/@svgr/rollup/dist/index.js";
import { VitePWA } from "file:///C:/Users/DouglasMashonganyika/Documents/GitHub/medvault-passport/node_modules/vite-plugin-pwa/dist/index.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEb3VnbGFzTWFzaG9uZ2FueWlrYVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXG1lZHZhdWx0LXBhc3Nwb3J0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEb3VnbGFzTWFzaG9uZ2FueWlrYVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXG1lZHZhdWx0LXBhc3Nwb3J0XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Eb3VnbGFzTWFzaG9uZ2FueWlrYS9Eb2N1bWVudHMvR2l0SHViL21lZHZhdWx0LXBhc3Nwb3J0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgc3ZnciBmcm9tICdAc3Znci9yb2xsdXAnO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5cclxuY29uc3QgbWFuaWZlc3RGb3JQbHVnSW4gPSB7XHJcbiAgcmVnaXN0ZXJUeXBlOiAncHJvbXB0JyxcclxuICBpbmNsdWRlQXNzZXN0czogWydmYXZpY29uLmljbycsIFwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIiwgXCJtYXNrZWQtaWNvbi5zdmdcIl0sXHJcbiAgbWFuaWZlc3Q6IHtcclxuICAgIGlkOiAnY29tLm1lZGFsZ28uYXBwJywgLy8gQWRkZWQgYXBwIElEXHJcbiAgICBuYW1lOiBcIk1lZGFsZ29cIixcclxuICAgIHNob3J0X25hbWU6IFwiTWVkYWxnb1wiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiQnJhaW4gdHVtb3IgZGV0ZWN0aW9uIGFuZCBjbGFzc2lmaWNhdGlvbiBhcHBsaWNhdGlvblwiLFxyXG4gICAgaWNvbnM6IFt7XHJcbiAgICAgIHNyYzogJy9hbmRyb2lkLWNocm9tZS0xOTJ4MTkyLnBuZycsXHJcbiAgICAgIHNpemVzOiAnMTkyeDE5MicsXHJcbiAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICBwdXJwb3NlOiAnYW55J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOiAnL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nJyxcclxuICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcclxuICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgIHB1cnBvc2U6ICdhbnknXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzcmM6ICcvYXBwbGUtdG91Y2gtaWNvbi5wbmcnLFxyXG4gICAgICBzaXplczogJzE4MHgxODAnLFxyXG4gICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgcHVycG9zZTogJ2FwcGxlIHRvdWNoIGljb24nLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOiAnL21hc2thYmxlLnBuZycsXHJcbiAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJyxcclxuICAgIH1cclxuICAgIF0sXHJcbiAgICB0aGVtZV9jb2xvcjogJyM1NkJCNkUnLFxyXG4gICAgYmFja2dyb3VuZF9jb2xvcjogJyNGRkZGRkYnLCAvLyBDaGFuZ2VkIHRvIGhleCBmb3JtYXRcclxuICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgc2NvcGU6ICcvJyxcclxuICAgIHN0YXJ0X3VybDogXCIvXCIsXHJcbiAgICBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZSdcclxuICB9LFxyXG4gIGxhdW5jaF9oYW5kbGVyOiB7XHJcbiAgICBjbGllbnRfbW9kZTogW1wibmF2aWdhdGUtZXhpc3RpbmdcIiwgXCJhdXRvXCJdXHJcbiAgfSxcclxuICBzY3JlZW5zaG90czogW1xyXG4gICAge1xyXG4gICAgICBzcmM6IFwiL21lZGFsZ28vMS5wbmdcIixcclxuICAgICAgc2l6ZXM6IFwiMTI4MHg3MjBcIixcclxuICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgZm9ybV9mYWN0b3I6IFwid2lkZVwiLFxyXG4gICAgICBsYWJlbDogXCJIb21lc2NyZWVuIG9mIE1lZGFsZ29cIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOiBcIi9tZWRhbGdvLzIucG5nXCIsXHJcbiAgICAgIHNpemVzOiBcIjEyODB4NzIwXCIsXHJcbiAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgIGZvcm1fZmFjdG9yOiBcIndpZGVcIixcclxuICAgICAgbGFiZWw6IFwiSG9tZXNjcmVlbiBvZiBNZWRhbGdvXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHNyYzogXCIvbWVkYWxnby8zLnBuZ1wiLFxyXG4gICAgICBzaXplczogXCIxMjgweDcyMFwiLFxyXG4gICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICBmb3JtX2ZhY3RvcjogXCJ3aWRlXCIsXHJcbiAgICAgIGxhYmVsOiBcIkhvbWVzY3JlZW4gb2YgTWVkYWxnb1wiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzcmM6IFwiL21lZGFsZ28vNC5wbmdcIixcclxuICAgICAgc2l6ZXM6IFwiMTI4MHg3MjBcIixcclxuICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgZm9ybV9mYWN0b3I6IFwid2lkZVwiLFxyXG4gICAgICBsYWJlbDogXCJIb21lc2NyZWVuIG9mIE1lZGFsZ29cIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOiBcIi9tZWRhbGdvLzUucG5nXCIsXHJcbiAgICAgIHNpemVzOiBcIjEyODB4NzIwXCIsXHJcbiAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgIGZvcm1fZmFjdG9yOiBcIndpZGVcIixcclxuICAgICAgbGFiZWw6IFwiSG9tZXNjcmVlbiBvZiBNZWRhbGdvXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHNyYzogXCIvbWVkYWxnby82LnBuZ1wiLFxyXG4gICAgICBzaXplczogXCIxMjgweDcyMFwiLFxyXG4gICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICBmb3JtX2ZhY3RvcjogXCJ3aWRlXCIsXHJcbiAgICAgIGxhYmVsOiBcIkhvbWVzY3JlZW4gb2YgTWVkYWxnb1wiXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgY2F0ZWdvcmllczogW1wibWVkaWNhbFwiLCBcImhlYWx0aGNhcmVcIiwgXCJhcnRpZmljaWFsLWludGVsbGlnZW5jZVwiXSxcclxuICBkaXI6IFwibHRyXCIsXHJcbiAgbGFuZzogXCJlblwiLFxyXG4gIHNjb3BlX2V4dGVuc2lvbnM6IFtcclxuICAgIHtcclxuICAgICAgXCJvcmlnaW5cIjogXCIqLm1lZGFsZ28uY29tXCJcclxuICAgIH1cclxuICBdLFxyXG4gIHdvcmtib3g6IHtcclxuICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiA2ICogMTAyNCAqIDEwMjQgLy8gU2V0IGNhY2hlIGxpbWl0IHRvIDYgTWlCXHJcbiAgfVxyXG59XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBzdmdyKCksIFZpdGVQV0EobWFuaWZlc3RGb3JQbHVnSW4pXSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4WCxTQUFTLG9CQUFvQjtBQUMzWixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZUFBZTtBQUV4QixJQUFNLG9CQUFvQjtBQUFBLEVBQ3hC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
