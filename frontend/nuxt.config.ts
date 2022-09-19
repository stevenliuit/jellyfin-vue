import { NuxtRouteConfig } from '@nuxt/types/config/router';
import type { NuxtConfig } from '@nuxt/types';
import { siJellyfin as jellyfinIcon } from 'simple-icons/icons';

const config: NuxtConfig = {
  /*
   ** Nuxt Environment Variables
   ** See https://nuxtjs.org/docs/configuration-glossary/configuration-env
   */
  env: {
    /**
     * Comma separated list of predefined servers (I.e. 'http://192.168.1.1' or 'http://192.168.1.1, https://your.server.domain')
     */
    server_url_list: process.env.DEFAULT_SERVERS || '',
    /**
     * Commit hash of the current build. Automatically set in CI
     */
    commit_hash:
      process.env.COMMIT_HASH || process.env.CF_PAGES_COMMIT_SHA || ''
  },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  ssr: false,
  /*
   ** Disables telemetry prompt while installing dependencies
   ** See https://github.com/nuxt/telemetry
   */
  telemetry: false,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Module loading mode
   ** See https://nuxtjs.org/api/configuration-modern
   */
  modern: false,
  /*
   ** Progress bar between routes
   ** See https://nuxtjs.org/api/configuration-loading
   */
  loading: {
    color: '#00A4DC',
    failedColor: '#FF5252',
    height: '4px'
  },
  pwa: {
    meta: {
      nativeUI: true,
      appleStatusBarStyle: 'black-translucent',
      name: 'Jellyfin',
      theme_color: '#1c2331'
    },
    manifest: {
      name: 'Jellyfin',
      background_color: '#14141F'
    }
  },
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - Jellyfin',
    title: 'Jellyfin',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/global.scss',
    '~/assets/transitions.scss',
    '@mdi/font/css/materialdesignicons.css',
    'vuetify/src/styles/styles.sass'
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    /**
     * THE LOAD ORDER OF THE PLUGINS IS RELEVANT
     */
    /*
     ** Pinia plugins (need to be loaded first to ensure persistence)
     */
    'plugins/store/index.ts',
    /**
     * Axios plugins
     *
     * Load first our custom axios instance and, afterwards, the API
     */
    'plugins/nuxt/axios.ts',
    'plugins/nuxt/apiPlugin.ts',
    /**
     * Rest of Nuxt plugins
     */
    'plugins/nuxt/browserDetectionPlugin.ts',
    'plugins/nuxt/appInit.ts',
    'plugins/nuxt/axe.ts',
    'plugins/nuxt/veeValidate.ts',
    'plugins/nuxt/playbackProfilePlugin.ts',
    'plugins/nuxt/supportedFeaturesPlugin.ts',
    /*
     ** Vue plugins
     */
    'plugins/vue/components.ts',
    'plugins/vue/directives.ts'
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: [{ path: '~/components', pathPrefix: false }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@nuxtjs/date-fns',
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: true }]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/i18n', '@nuxtjs/pwa'],
  /*
   ** Router configuration
   */
  router: {
    middleware: ['auth', 'meta'],
    extendRoutes(routes: NuxtRouteConfig[]): void {
      // Extend all routes to be accessed by /index.html
      for (const route of routes) {
        if (route.path.slice(-1) === '/') {
          route.alias = route.path + 'index.html';
        } else {
          route.alias = route.path + '/index.html';
        }
      }
    },
    mode: process.env.HISTORY_ROUTER_MODE === '1' ? 'history' : 'hash'
  },
  i18n: {
    locales: [
      { code: 'en-US', iso: 'en-US', name: 'English', file: 'en-US.json' },
      { code: 'zh-CN', iso: 'zh-CN', name: '简体中文', file: 'zh_Hans.json' }
    ],
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    defaultLocale: 'zh-CN',
    vueI18n: {
      fallbackLocale: 'zh-CN'
    }
  },
  dateFns: {
    locales: [
      'en-US',
      'zh-CN'
    ],
    defaultLocale: 'zh-CN',
    fallbackLocale: 'zh-CN'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: false,
    theme: {
      dark: true,
      default: 'dark',
      disable: false,
      themes: {
        dark: {
          primary: '#9d37c2',
          secondary: '#2f3951',
          accent: '#FF4081',
          info: '#0099CC',
          warning: '#FB8C00',
          error: '#FF5252',
          success: '#4CAF50',
          background: '#14141F',
          card: '#1c2331',
          thumb: '#252e41'
        },
        light: {
          primary: '#9d37c2',
          secondary: '#424242',
          accent: '#FF4081',
          info: '#33b5e5',
          warning: '#FB8C00',
          error: '#FF5252',
          success: '#4CAF50',
          background: '#f2f2f2',
          card: '#FFFFFF',
          thumb: '#000000'
        }
      },
      options: {
        customProperties: true
      }
    },
    icons: {
      iconfont: 'mdi',
      values: {
        jellyfin: jellyfinIcon.path
      }
    }
  },
  loadingIndicator: {
    name: 'assets/loading.html'
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    loadingScreen: {
      image: 'icon.png',
      colors: {
        client: '#00A4DC',
        modern: '#aa5cc3',
        server: '#424242'
      }
    },
    optimizeCSS: true,
    extractCSS: {
      ignoreOrder: true
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    extend(config, ctx): void {
      if (ctx.isClient) {
        config?.module?.rules.push({
          test: /\.worker\.ts$/,
          use: [
            {
              loader: 'comlink-loader',
              options: {
                singleton: true
              }
            }
          ],
          exclude: /(node_modules)/
        });
      }

      config.module?.rules.push(
        // Hacky rule to make the libass WASM not being parsed when requiring it for the file loader
        // https://github.com/webpack/webpack/issues/6725#issuecomment-391237775
        {
          test: /libass-wasm([\\]+|\/)dist([\\]+|\/)js([\\]+|\/)subtitles-octopus-worker\.wasm/,
          type: 'javascript/auto'
        },
        {
          test: /libass-wasm([\\]+|\/)dist([\\]+|\/)js([\\]+|\/)subtitles-octopus-worker/,
          loader: 'file-loader',
          options: { name: '[name].[ext]' }
        }
      );
    },
    transpile: ['screenfull']
  },

  /**
   * Host set to 0.0.0.0 in order to access the dev server on the LAN
   */
  server: {
    host: '0.0.0.0'
  }
};

export default config;
