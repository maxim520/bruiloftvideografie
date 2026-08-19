import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '5o909qb6',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    // Voorkomt dat een volgende `sanity deploy` opnieuw om de app-id vraagt
    // — hoort bij https://behindeverywedding.sanity.studio.
    appId: 'bt0ysoe56y8xseuks5ho24t7',
  },
})
