import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:5173',
    // specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    // screenshotOnRunFailure: true,
    // video: false,
    // viewportWidth: 1920,
    // viewportHeight: 1080,
    // supportFile: 'cypress/support/e2e.ts',

    // setupNodeEvents(on, config) {
    //   on('before:browser:launch', (_, launchOptions) => {
    //     // passing the environment variables to the browser
    //     launchOptions.args.push(`--env=API_URL=${config.env.API_URL}`)
    //     return launchOptions
    //   })
    // },
  },
})
