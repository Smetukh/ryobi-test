import React, { useEffect, useState, useRef } from 'react';
import { controller } from "../../threekit"

const usePlayer = ({dataStore}) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [assetLoadingState, setAssetLoadingState] = useState(1)
  const { hostContext } = dataStore

  useEffect(() => {

    controller.launch({
      additionalTools: undefined,
      allowMobileVerticalOrbit: false,
      assetId: hostContext.assetId,
      authToken: hostContext.authToken,
      cache: undefined,
      elementId: "tk-player",
      initialConfiguration: undefined,
      language: undefined,
      locale: undefined,
      onLoadingProgress: undefined,
      orgId: hostContext.orgId,
      publishStage: "draft",
      serverUrl: undefined,
      showAR: hostContext.showAR,
      showConfigurator: false,
      showLoadingProgress: true,
      showLoadingThumbnail: false,
      showShare: false,
      stageId: undefined,
      threekitEnv: hostContext.threekitEnv
    }).then(() => {
      window.threekit.player.on('progress', (progressState) => {
        setAssetLoadingState(progressState)
      })
      setIsPlayerReady(true)
    })

  }, [])

  return {
    isPlayerReady,
    assetLoadingState
    // isPlayerLoading
  }
}

export default usePlayer