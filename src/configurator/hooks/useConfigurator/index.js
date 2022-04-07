import React, { useEffect, useState, useRef, useContext } from 'react';
import { wall } from '../../../components/ryobi/constant.js';
import {
  lockCamera,
  addWallDragTool,
  addWallItemById,
  addMobileDragTool,
  addMobileItemById,
  focusOnMobile,
  focusOnWall,
  makeGrid,
  updateGrid,
  makeStack,
  addWallRail,
  setSceneConfig,
  saveGlobalState,
  shareGlobalState,
  loadGlobalState,
  resetGlobalState,
  resetWallGrid,
  resetMobileStack,
  removeAllTools,
  removeWallItemById,
  removeMobileItemById,
} from './configurator/index.js'

const useConfigurator = ({ itemsStore, playerStore, dataStore }) => {
  const { wallAssets, mobileAssets } = itemsStore
  const { isPlayerReady } = playerStore
  const { wallSizes, hostContext } = dataStore

  const defaultWallHeight = wallSizes.height[0]
  const defaultWallWidth = wallSizes.width[1]

  const [configuratorView, setConfiguratorView] = useState(hostContext.initConfiguratorView)
  
  const [mobileItems, setMobileItems] = useState([])
  const [wallItems, setWallItems] = useState([])
  const [allItems, setAllItems] = useState([])
  
  const [wallInMobileItems, setWallInMobileItems] = useState([])
  const [mobileInWallItems, setMobileInWallItems] = useState([])

  const [wallHeight, setWallHeightState] = useState(defaultWallHeight.m)
  const [wallWidth, setWallWidthState] = useState(defaultWallWidth.m)

  const [isAboutToDelete, setIsAboutToDelete] = useState(false)

  const grid = useRef()
  const stack = useRef()

  const wallItemsRef = useRef(wallItems)
  const mobileItemsRef = useRef(mobileItems)

  wallItemsRef.current = wallItems
  mobileItemsRef.current = mobileItems

  useEffect(() => {
    async function initPlayer() {
        const { grid: gridToLoad, stack: stackToLoad, wallItems, mobileItems, wallHeight, wallWidth, configuratorView: configuratorViewToLoad } = await loadGlobalState(wallAssets, mobileAssets)
        initState(gridToLoad, stackToLoad, wallItems, mobileItems, wallHeight, wallWidth)
        const viewToSet = configuratorViewToLoad || configuratorView
        if (viewToSet === 'wall') {
          setFocusOnWall()
        } else if (viewToSet === 'mobile') {
          setFocusOnMobile()
        }
    }
    if (isPlayerReady) {
      initPlayer()
    }
  }, [isPlayerReady])

  useEffect(() => {
    const items = {}
    const concated = [...wallItems, ...mobileItems]

    concated.forEach(el => {
      if (!items[el.itemId]) {
        items[el.itemId] = 1
      } else {
        items[el.itemId]++
      }
    })

    setAllItems(Object.entries(items).map(([k,v])=> ({id: k, qty: v})))
    setWallInMobileItems(wallItems.filter(el => el.mobileAlternative))
    setMobileInWallItems(mobileItems.filter(el => el.wallAlternative))

  }, [wallItems, mobileItems])

  useEffect(() => {
    if (isPlayerReady) {
      saveGlobalState(grid.current, stack.current, wallItems, mobileItems, configuratorView)
    }
  }, [wallItems, mobileItems, configuratorView])

  const initState = (gridToLoad, stackToLoad, wallItems, mobileItems, wallHeight, wallWidth) => {
    initMobileState(stackToLoad, mobileItems)
    initWallState(gridToLoad, wallItems, wallHeight, wallWidth)
  }

  const initWallState = (gridToLoad, wallItems, wallHeight, wallWidth) => {
    grid.current = gridToLoad
    setWallItems(wallItems)
    setWallHeightState(wallHeight)
    setWallWidthState(wallWidth)
  }

  const initMobileState = (stackToLoad, mobileItems) => {
    stack.current = stackToLoad
    setMobileItems(mobileItems)
  }

  const onDeleteWallNode = (nodeId) => {
    setWallItems([...wallItemsRef.current.filter(el => el.nodeId !== nodeId)])
  }

  const onDeleteMobileNode = (nodeId) => {
    setMobileItems([...mobileItemsRef.current.filter(el => el.nodeId !== nodeId)])
  }

  const setFocusOnMobile = () => {
    setConfiguratorView('mobile')
    focusOnMobile()
    removeAllTools()
    addMobileDragTool(stack.current, mobileAssets, onDeleteMobileNode, (draggedToDelete) => {
      setIsAboutToDelete(draggedToDelete)
    })
  }

  const setFocusOnWall = () => {
    setConfiguratorView('wall')
    focusOnWall()
    removeAllTools()
    addWallDragTool(grid.current, wallAssets, onDeleteWallNode, (draggedToDelete) => {
      setIsAboutToDelete(draggedToDelete)
    })
  }

  const setWallWidth = async (wallWidthSize) => {
    const newGrid = updateGrid(grid.current, onDeleteWallNode, {x: wallWidthSize.m, y: wallHeight})

    if (!newGrid) return false
    
    await setSceneConfig({
      'Wall Width': wallWidthSize.m,
      'Wall Width Offset': wallWidthSize.offset,
      'Mobile Storage Offset': wallWidthSize['mobile x']
    })

    grid.current = newGrid
    setWallWidthState(wallWidthSize.m)
    setFocusOnWall()
    return true
  }

  const setWallHeight = async (wallHeightSize) => {
    const newGrid = updateGrid(grid.current, onDeleteWallNode, {x: wallWidth, y: wallHeightSize.m})

    if (!newGrid) return false

    await setSceneConfig({
      'Wall Height': wallHeightSize.m,
      'Wall Height Offset': wallHeightSize.offset,
    })
    grid.current = newGrid
    setWallHeightState(wallHeightSize.m)
    setFocusOnWall()
    return true
  }

  const addMobileItemByIdWrapper = async (itemId) => {
    const nodeId = await addMobileItemById(itemId, mobileAssets, stack.current)
    if (nodeId) {
      setMobileItems([...mobileItems, { itemId, nodeId, wallAlternative: mobileAssets.find(el => el.id === itemId).wallAlternative }])
      return true
    } else {
      return false
    }
  }
  
  const addWallRailWrapper = async () => {
    const nodeId = await addWallRail(grid.current)
    if (nodeId) {
      setWallItems([...wallItems, { itemId: wallAssets.find(el => el.assetType === 'rail').id, nodeId }])
      return true
    } else {
      return false
    }
  }
  
  const addWallItemByIdWrapper = async (itemId) => {
    const nodeId = await addWallItemById(itemId, wallAssets, grid.current)
    if (nodeId) {
      setWallItems([...wallItems, { itemId, nodeId, mobileAlternative: wallAssets.find(el => el.id === itemId).mobileAlternative }])
      return true
    } else {
      if (!(await addWallRailWrapper())) return false; // return if wall rail was not added
      addWallItemByIdWrapper(itemId) // recursively try to add a product
      return true
    }
  } 

  return {
    lockCamera,
    setFocusOnMobile,
    setFocusOnWall,
    configuratorView,
    addMobileItemById: addMobileItemByIdWrapper,
    addWallRail: addWallRailWrapper,
    addWallItemById: addWallItemByIdWrapper,
    addFromWallToMobile: async (itemId) => {
      const item = wallItems.find(el => el.itemId === itemId)
      if ((await addMobileItemByIdWrapper(item.mobileAlternative))) {
        await removeWallItemById(item.nodeId, grid.current)
        onDeleteWallNode(item.nodeId)
        return true
      } else {
        return false
      }
    },
    addFromMobileToWall: async (itemId) => {
      const item = mobileItems.find(el => el.itemId === itemId)
      if ((await addWallItemByIdWrapper(item.wallAlternative))) {
        await removeMobileItemById(item.nodeId, stack.current)
        onDeleteMobileNode(item.nodeId)
        return true
      } else {
        return false
      }
    },
    wallHeight,
    wallWidth,
    setWallWidth,
    setWallHeight,
    shareGlobalState: async () => {
      await saveGlobalState(grid.current, stack.current, wallItems, mobileItems, configuratorView)
      return shareGlobalState()
    },
    resetGlobalState: async () => {
      const { grid: gridToLoad, stack: stackToLoad, wallItems: wallItemsToLoad, mobileItems: mobileItemsToLoad, wallHeight, wallWidth } = await resetGlobalState(wallAssets, mobileAssets, wallItems, mobileItems)
      initState(gridToLoad, stackToLoad, wallItemsToLoad, mobileItemsToLoad, wallHeight, wallWidth)
      setFocusOnWall()
    },
    resetWallState: async () => {
      const { grid: gridToLoad } = await resetWallGrid(grid.current, {x: defaultWallWidth.m, y: defaultWallHeight.m})
      await setSceneConfig({
        'Wall Width': defaultWallWidth.m,
        'Wall Width Offset': defaultWallWidth.offset,
        'Mobile Storage Offset': defaultWallWidth['mobile x'],
        'Wall Height': defaultWallHeight.m,
        'Wall Height Offset': defaultWallHeight.offset,
      })
      initWallState(gridToLoad, [], defaultWallHeight.m, defaultWallWidth.m)
      setFocusOnWall()
    },
    resetMobileState: async () => {
      const { stack: stackToLoad } = await resetMobileStack(stack.current)
      initMobileState(stackToLoad, [])
      setFocusOnMobile()
    },
    wallItems,
    mobileItems,
    allConfiguratorItems: allItems,
    wallInMobileItems,
    mobileInWallItems,
    isAboutToDelete
  }
};

export default useConfigurator;
