// vite.config.js
import { defineConfig } from "file:///C:/Users/Douglas%20Masho/Documents/GitHub/medalgo-client-pwa/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Douglas%20Masho/Documents/GitHub/medalgo-client-pwa/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///C:/Users/Douglas%20Masho/Documents/GitHub/medalgo-client-pwa/node_modules/@svgr/rollup/dist/index.js";
import { VitePWA } from "file:///C:/Users/Douglas%20Masho/Documents/GitHub/medalgo-client-pwa/node_modules/vite-plugin-pwa/dist/index.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEb3VnbGFzIE1hc2hvXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbWVkYWxnby1jbGllbnQtcHdhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEb3VnbGFzIE1hc2hvXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbWVkYWxnby1jbGllbnQtcHdhXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Eb3VnbGFzJTIwTWFzaG8vRG9jdW1lbnRzL0dpdEh1Yi9tZWRhbGdvLWNsaWVudC1wd2Evdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcbmltcG9ydCBzdmdyIGZyb20gJ0BzdmdyL3JvbGx1cCc7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XHJcblxyXG5jb25zdCBtYW5pZmVzdEZvclBsdWdJbiA9IHtcclxuICByZWdpc3RlclR5cGU6J3Byb21wdCcsXHJcbiAgaW5jbHVkZUFzc2VzdHM6WydmYXZpY29uLmljbycsIFwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIiwgXCJtYXNrZWQtaWNvbi5zdmdcIl0sXHJcbiAgbWFuaWZlc3Q6e1xyXG4gICAgaWQ6ICdjb20ubWVkYWxnby5hcHAnLCAvLyBBZGRlZCBhcHAgSURcclxuICAgIG5hbWU6XCJNZWRhbGdvXCIsXHJcbiAgICBzaG9ydF9uYW1lOlwiTWVkYWxnb1wiLFxyXG4gICAgZGVzY3JpcHRpb246XCJCcmFpbiB0dW1vciBkZXRlY3Rpb24gYW5kIGNsYXNzaWZpY2F0aW9uIGFwcGxpY2F0aW9uXCIsXHJcbiAgICBpY29uczpbe1xyXG4gICAgICBzcmM6ICcvYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmcnLFxyXG4gICAgICBzaXplczonMTkyeDE5MicsXHJcbiAgICAgIHR5cGU6J2ltYWdlL3BuZycsXHJcbiBwdXJwb3NlOiAnYW55J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOicvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmcnLFxyXG4gICAgICBzaXplczonNTEyeDUxMicsXHJcbiAgICAgIHR5cGU6J2ltYWdlL3BuZycsXHJcbiBwdXJwb3NlOiAnYW55J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOiAnL2FwcGxlLXRvdWNoLWljb24ucG5nJyxcclxuICAgICAgc2l6ZXM6JzE4MHgxODAnLFxyXG4gICAgICB0eXBlOidpbWFnZS9wbmcnLFxyXG4gICAgICBwdXJwb3NlOidhcHBsZSB0b3VjaCBpY29uJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHNyYzogJy9tYXNrYWJsZS5wbmcnLFxyXG4gICAgICBzaXplczonNTEyeDUxMicsXHJcbiAgICAgIHR5cGU6J2ltYWdlL3BuZycsXHJcbiAgICAgIHB1cnBvc2U6J2FueSBtYXNrYWJsZScsXHJcbiAgICB9XHJcbiAgXSxcclxuICB0aGVtZV9jb2xvcjonIzAwOTRGRicsXHJcbiAgYmFja2dyb3VuZF9jb2xvcjogJyNGRkZGRkYnLCAvLyBDaGFuZ2VkIHRvIGhleCBmb3JtYXRcclxuICBkaXNwbGF5Olwic3RhbmRhbG9uZVwiLFxyXG4gIHNjb3BlOicvJyxcclxuICBzdGFydF91cmw6XCIvXCIsXHJcbiAgb3JpZW50YXRpb246J2xhbmRzY2FwZSdcclxuICB9LFxyXG4gIGxhdW5jaF9oYW5kbGVyOiB7XHJcbiAgICBjbGllbnRfbW9kZTogW1wibmF2aWdhdGUtZXhpc3RpbmdcIiwgXCJhdXRvXCJdXHJcbiAgfSxcclxuICBzY3JlZW5zaG90czogW1xyXG4gICAge1xyXG4gICAgICBzcmM6IFwiL21lZGFsZ28vMS5wbmdcIixcclxuICAgICAgc2l6ZXM6IFwiMTI4MHg3MjBcIixcclxuICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgZm9ybV9mYWN0b3I6IFwid2lkZVwiLFxyXG4gICAgICBsYWJlbDogXCJIb21lc2NyZWVuIG9mIE1lZGFsZ29cIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOiBcIi9tZWRhbGdvLzIucG5nXCIsXHJcbiAgICAgIHNpemVzOiBcIjEyODB4NzIwXCIsXHJcbiAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgIGZvcm1fZmFjdG9yOiBcIndpZGVcIixcclxuICAgICAgbGFiZWw6IFwiSG9tZXNjcmVlbiBvZiBNZWRhbGdvXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHNyYzogXCIvbWVkYWxnby8zLnBuZ1wiLFxyXG4gICAgICBzaXplczogXCIxMjgweDcyMFwiLFxyXG4gICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICBmb3JtX2ZhY3RvcjogXCJ3aWRlXCIsXHJcbiAgICAgIGxhYmVsOiBcIkhvbWVzY3JlZW4gb2YgTWVkYWxnb1wiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzcmM6IFwiL21lZGFsZ28vNC5wbmdcIixcclxuICAgICAgc2l6ZXM6IFwiMTI4MHg3MjBcIixcclxuICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgZm9ybV9mYWN0b3I6IFwid2lkZVwiLFxyXG4gICAgICBsYWJlbDogXCJIb21lc2NyZWVuIG9mIE1lZGFsZ29cIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc3JjOiBcIi9tZWRhbGdvLzUucG5nXCIsXHJcbiAgICAgIHNpemVzOiBcIjEyODB4NzIwXCIsXHJcbiAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgIGZvcm1fZmFjdG9yOiBcIndpZGVcIixcclxuICAgICAgbGFiZWw6IFwiSG9tZXNjcmVlbiBvZiBNZWRhbGdvXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHNyYzogXCIvbWVkYWxnby82LnBuZ1wiLFxyXG4gICAgICBzaXplczogXCIxMjgweDcyMFwiLFxyXG4gICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICBmb3JtX2ZhY3RvcjogXCJ3aWRlXCIsXHJcbiAgICAgIGxhYmVsOiBcIkhvbWVzY3JlZW4gb2YgTWVkYWxnb1wiXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgY2F0ZWdvcmllczogW1wibWVkaWNhbFwiLCBcImhlYWx0aGNhcmVcIiwgXCJhcnRpZmljaWFsLWludGVsbGlnZW5jZVwiXSxcclxuICBkaXI6IFwibHRyXCIsXHJcbiAgbGFuZzogXCJlblwiLFxyXG4gIHNjb3BlX2V4dGVuc2lvbnM6IFtcclxuICAgIHtcclxuICAgICAgXCJvcmlnaW5cIjogXCIqLm1lZGFsZ28uY29tXCJcclxuICAgIH1cclxuICBdLFxyXG4gIHdvcmtib3g6IHtcclxuICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiA2ICogMTAyNCAqIDEwMjQgLy8gU2V0IGNhY2hlIGxpbWl0IHRvIDYgTWlCXHJcbiAgfVxyXG59XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBzdmdyKCksIFZpdGVQV0EobWFuaWZlc3RGb3JQbHVnSW4pXSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VyxTQUFTLG9CQUFvQjtBQUMzWSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZUFBZTtBQUV4QixJQUFNLG9CQUFvQjtBQUFBLEVBQ3hCLGNBQWE7QUFBQSxFQUNiLGdCQUFlLENBQUMsZUFBZSx3QkFBd0IsaUJBQWlCO0FBQUEsRUFDeEUsVUFBUztBQUFBLElBQ1AsSUFBSTtBQUFBO0FBQUEsSUFDSixNQUFLO0FBQUEsSUFDTCxZQUFXO0FBQUEsSUFDWCxhQUFZO0FBQUEsSUFDWixPQUFNO0FBQUEsTUFBQztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsT0FBTTtBQUFBLFFBQ04sTUFBSztBQUFBLFFBQ1YsU0FBUztBQUFBLE1BQ047QUFBQSxNQUNBO0FBQUEsUUFDRSxLQUFJO0FBQUEsUUFDSixPQUFNO0FBQUEsUUFDTixNQUFLO0FBQUEsUUFDVixTQUFTO0FBQUEsTUFDTjtBQUFBLE1BQ0E7QUFBQSxRQUNFLEtBQUs7QUFBQSxRQUNMLE9BQU07QUFBQSxRQUNOLE1BQUs7QUFBQSxRQUNMLFNBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLFFBQ0UsS0FBSztBQUFBLFFBQ0wsT0FBTTtBQUFBLFFBQ04sTUFBSztBQUFBLFFBQ0wsU0FBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxhQUFZO0FBQUEsSUFDWixrQkFBa0I7QUFBQTtBQUFBLElBQ2xCLFNBQVE7QUFBQSxJQUNSLE9BQU07QUFBQSxJQUNOLFdBQVU7QUFBQSxJQUNWLGFBQVk7QUFBQSxFQUNaO0FBQUEsRUFDQSxnQkFBZ0I7QUFBQSxJQUNkLGFBQWEsQ0FBQyxxQkFBcUIsTUFBTTtBQUFBLEVBQzNDO0FBQUEsRUFDQSxhQUFhO0FBQUEsSUFDWDtBQUFBLE1BQ0UsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sYUFBYTtBQUFBLE1BQ2IsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixhQUFhO0FBQUEsTUFDYixPQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLGFBQWE7QUFBQSxNQUNiLE9BQU87QUFBQSxJQUNUO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sYUFBYTtBQUFBLE1BQ2IsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixhQUFhO0FBQUEsTUFDYixPQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLGFBQWE7QUFBQSxNQUNiLE9BQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUFBLEVBQ0EsWUFBWSxDQUFDLFdBQVcsY0FBYyx5QkFBeUI7QUFBQSxFQUMvRCxLQUFLO0FBQUEsRUFDTCxNQUFNO0FBQUEsRUFDTixrQkFBa0I7QUFBQSxJQUNoQjtBQUFBLE1BQ0UsVUFBVTtBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCwrQkFBK0IsSUFBSSxPQUFPO0FBQUE7QUFBQSxFQUM1QztBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsUUFBUSxpQkFBaUIsQ0FBQztBQUN2RCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
