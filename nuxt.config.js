module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Digicatch',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  router: {
    middleware: ['authorization']
  },

  plugins: [
    '~/plugins/vuetify.js',
    {
      src: "~/plugins/leaflet",
      ssr: false
    }
  ],

  modules: [
    'cookie-universal-nuxt',
    "@nuxtjs/toast"
  ],

  css: ['~/assets/style/app.styl', "leaflet/dist/leaflet.css"],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  toast: {
      position: 'bottom-right',
      duration: 4000
  },

  server: {
    port: 8080
  },
  
  mode: 'spa'
}
