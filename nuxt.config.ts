export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  routeRules: {
    // revalidate after 60 seconds
    "/isr_ttl": { isr: 60 },
    "/isr_no_ttl": { isr: true },
    "/swr_ttl": { swr: 60 },
    "/swr_no_ttl": { swr: true },
    "/ssg": { prerender: true },
    "/spa": { ssr: false },
    "/wp-ssg": { isr: 60 },
    "/wp/**": { isr: true },
  },

  // router: {
  //   routes: [
  //     {
  //       path: '/pages/wp/:id',
  //       component: '@/pages/wp/[id].vue'
  //     }
  //   ]
  // },

  // @see https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {
      baseUrl: "/",
      maintenanceMode: false,
      wpUri: "https://api.collaborationbetterstheworld.com",
    },
  },
  i18n: {
    defaultLocale: "en",
    detectBrowserLanguage: false,
    langDir: "lang/",
    locales: [
      {
        code: "en",
        file: "en.json",
        name: "English",
      },
      /* {
        code: 'de',
        file: 'de.json'
        name: 'Deutsch',
      }, */
    ],
    strategy: "prefix_except_default",
  },
});
