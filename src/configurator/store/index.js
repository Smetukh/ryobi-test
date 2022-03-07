import React from 'react'
import useConfigurator from '../hooks/useConfigurator'
import usePlayer from '../hooks/usePlayer'
import wallAssets from '../data/wall-assets.js'
import mobileAssets from '../data/mobile-assets.js'
import wallSizes from '../data/wall-sizes.json'

export const ConfiguratorContext = React.createContext(null)

const ConfiguratorStore = ({ children }) => {

  const dataStore = {
    wallAssets,
    mobileAssets,
    wallSizes,
    hostContext: {
      orgId: window.tkLinkBuilderSettings?.orgId || process.env.THREEKIT_ORG_ID,
      authToken: window.tkLinkBuilderSettings?.authToken || process.env.THREEKIT_AUTH_TOKEN,
      assetId: window.tkLinkBuilderSettings?.assetId || process.env.THREEKIT_ASSET_ID,
      serverUrl: window.tkLinkBuilderSettings?.serverUrl || process.env.SERVER_URL,
      threekitEnv: window.tkLinkBuilderSettings?.threekitEnv || process.env.THREEKIT_ENV,
      showAR: window.tkLinkBuilderSettings?.showAR !== undefined ? window.tkLinkBuilderSettings?.showAR : process.env.SHOW_AR === 'true',
      initConfiguratorView: window.tkLinkBuilderSettings?.initConfiguratorView || process.env.INIT_CONFIGURATOR_VIEW,
      onLearnMoreClicked: window.tkLinkBuilderSettings?.onLearnMoreClicked || (()=>{}),
      onBuyNowClicked: window.tkLinkBuilderSettings?.onBuyNowClicked || (()=>{}),
    }
  }
const playerStore = usePlayer({ dataStore })

const store = {
  playerStore,
  configuratorStore: useConfigurator({ playerStore, itemsStore: { wallAssets, mobileAssets }, dataStore }),
  dataStore
}

return <ConfiguratorContext.Provider value={store}>{children}</ConfiguratorContext.Provider>
}

export default ConfiguratorStore