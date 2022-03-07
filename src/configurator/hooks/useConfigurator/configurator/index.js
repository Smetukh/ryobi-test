import { positions } from '@mui/system'
import { addModel, removeModel, positionModel, rotateModel } from './helpers/threekit.js'

const NODE_PER_RAIL = 6

const RAIL_DIVISION_X = 6
const RAIL_DIVISION_Y = 1

const RAIL_X = 0.812
const RAIL_Y = 0.167

const RAIL_POSITION_Z = 0.0001
const ITEM_POSITION_Z = 0.0002

const STEP_X = RAIL_X / RAIL_DIVISION_X
const STEP_Y = RAIL_Y / RAIL_DIVISION_Y

const ITEM_MOBILE_ID = 'c95ebcec-9f2a-4b0e-a8f0-9ab193237508'
const ITEM_WALL_ID = '2b1a9387-96dd-41a8-b47c-987a532f0048'
const RAIL_WALL_ID = '2da02b7a-a989-4433-9bb2-52da62a498c5'

const INIT_CONFIG_ID = "oFrVgYneD"

// const MOBILE_HOUSING_HEIGHT = 0.38472167198237

function getBoundsFromQuery(queryObject) {
  const nodeBounds = window.threekit.player.scene
    .get({ ...queryObject, evalNode: true })
    .getBoundingBox()

  const nodeXLength = nodeBounds.max.x - nodeBounds.min.x
  const nodeYLength = nodeBounds.max.y - nodeBounds.min.y
  const nodeZLength = nodeBounds.max.z - nodeBounds.min.z

  return {
    nodeBounds,
    nodeXLength,
    nodeYLength,
    nodeZLength
  }
}

function getTranslationForNodeId(nodeId) {
  return window.threekit.player.scene.get({
    id: nodeId,
    plug: 'Transform',
    property: 'translation',
  })
}

function getTranslationForName(name) {
  return window.threekit.player.scene.get({
    name,
    plug: 'Transform',
    property: 'translation',
  })
}

function getNodeIdByQuery(query) {
  return window.threekit.player.scene.find(query)
}

function getGridSpaceForItem(grid, gridPoint, itemSizes) {
  if (!gridPoint.rail) return null
  const [gridY, gridX] = gridPoint.id.split('-').map(el => parseInt(el))
  const itemGrid = []
  const safeBoxGrid = []

  for (let i = gridY; i < gridY + itemSizes.hookY; i++) {
    for (let ii = gridX; ii < gridX + itemSizes.hookX; ii++) {
      if (grid[i] && grid[i][ii]) {
        itemGrid.push(grid[i][ii])
      }
    }
  }

  for (let i = gridY - itemSizes.hookOffsetY; i < gridY - itemSizes.hookOffsetY + itemSizes.y; i++) {
    for (let ii = gridX - itemSizes.hookOffsetX; ii < gridX - itemSizes.hookOffsetX + itemSizes.x; ii++) {
      if (grid[i] && grid[i][ii]) {
        safeBoxGrid.push(grid[i][ii])
      }
    }
  }

  if (
    itemGrid.filter(el => el.rail && (!el.item || el.item === 'transit') && !el.blocked).length === itemGrid.length
    && itemGrid.length === (itemSizes.hookX * itemSizes.hookY)
    && !safeBoxGrid.filter(el => el.safeBox && el.safeBox !== 'transit').length
  ) {
    return { itemGrid, safeBoxGrid }
  } else {
    return null
  }
}

async function removeWallItemById(nodeId, grid) {
  grid.flat().forEach(el => {
    if (el.item === nodeId) {
      el.item = null
    }
    if (el.safeBox === nodeId) {
      el.safeBox = null
    }
    if (el.rail === nodeId) {
      el.rail = null
    }
  })
  removeModel(nodeId)
}

async function removeMobileItemById(nodeId, stack) {
  removeModel(nodeId)

  if (stack[stack.length - 1].nodeId !== nodeId) {
    const idx = stack.findIndex(el => el.nodeId === nodeId)
    stack.splice(idx, 1)
    stack.forEach((el,idx) => {
      const stackToItem = stack.slice(0, idx)
      const translation = {
        x: 0,
        y: 0 + stackToItem.reduce((sum, cur) => sum + cur.sizes.y, 0),
        z: 0
      }
      positionModel(el.nodeId, translation)
    })
  } else {
    stack.pop()
  }
  
  if (!stack.length) {
    await setSceneConfig({
      'Is Mobile Storage Visible': true
    })
  }
}

async function addWallItemById(itemId, wallAssets, grid) {
  const item = wallAssets.find(item => item.id === itemId)
  const { sizes } = item
  let itemGrid = null
  let safeBoxGrid = null
  grid.flat().filter(el => el.rail).forEach(gridPoint => {
    if (itemGrid) return
    const gridSpaceBox = getGridSpaceForItem(grid, gridPoint, sizes)
    itemGrid = gridSpaceBox?.itemGrid
    safeBoxGrid = gridSpaceBox?.safeBoxGrid
  })

  if (!itemGrid) return false
  const initialTranslation = {
    x: itemGrid[0].min.x,
    y: itemGrid[0].min.y,
    z: ITEM_POSITION_Z
  }
  const itemConfiguration = {
    Model: { assetId: item.id },
  }

  const nodeId = addModel(ITEM_WALL_ID, item.id, { translation: initialTranslation, configuration: itemConfiguration })
  itemGrid.forEach(el => { el.item = nodeId })
  safeBoxGrid.forEach(el => { el.safeBox = nodeId })
  return nodeId
}

async function addWallRail(grid) {

  const freeSlots = grid.flat().filter(el => !el.rail)
  if (!freeSlots.length) return false

  const gridPoint = freeSlots[0]

  const initialTranslation = {
    x: gridPoint.min.x,
    y: gridPoint.min.y,
    z: RAIL_POSITION_Z
  }

  const itemConfiguration = {
    Model: { assetId: RAIL_WALL_ID }
  }

  const nodeId = addModel(ITEM_WALL_ID, RAIL_WALL_ID, { translation: initialTranslation, configuration: itemConfiguration })

  freeSlots.filter(el => el.slot === gridPoint.slot).forEach(el => {
    el.rail = nodeId
  })

  freezeGridRail(grid)

  return nodeId
}

function freezeGridRail(grid) {
  const slots = {}
  const flatGrid = grid.flat()
    .forEach(el => {
      if (!slots[el.slot]) slots[el.slot] = []
      slots[el.slot].push(el)
    })

  Object.entries(slots).forEach(([slotName, slotGrid]) => {
    const [slotPrefix, slotRow, slotColumn] = slotName.split('-')
    const nextSlotName = [slotPrefix, slotRow, parseInt(slotColumn) + 1].join('-')

    if (slots[nextSlotName] && slots[nextSlotName][0].rail) {
      slotGrid[slotGrid.length - 1].blocked = false
    } else {
      slotGrid[slotGrid.length - 1].blocked = true
    }
  })
}

function doesHistLastInMobileStack(hitNodes, mobileAssets, stack) {
  return hitNodes
    && hitNodes[0]
    && stack[stack.length - 1]?.nodeId === hitNodes[0].hierarchy[2]?.nodeId
    && ['item', 'base'].includes(mobileAssets.find(el => hitNodes[0].hierarchy[2]?.name === el.id)?.assetType)
}


function doesHitWallItem(hitNodes, wallAssets) {
  return hitNodes
    && hitNodes[0]
    && wallAssets.find(el => hitNodes[0].hierarchy[1].name === el.id)?.assetType === 'item'
}

function doesHitRail(hitNodes, wallAssets) {
  return hitNodes
    && hitNodes[0]
    && wallAssets.find(el => hitNodes[0].hierarchy[1].name === el.id)?.assetType === 'rail'
}

function canRailNodeMove(nodeId, grid) {
  const railSlot = grid.flat().filter(el => el.rail == nodeId)
  if (!railSlot.length) return
  const [slotName, slotRow, slotColumn] = railSlot[0].slot.split('-')
  const prevSlotName = [slotName, slotRow, parseInt(slotColumn) - 1].join('-')
  const prevRailSlot = grid.flat().filter(el => el.slot === prevSlotName)

  return !(
    (prevRailSlot[prevRailSlot.length - 1] && prevRailSlot[prevRailSlot.length - 1].item)
    || railSlot.filter(el => el.item).length
  )
}

function addWallDragTool(grid, wallAssets, onDeleteNode, onHoverOffBounds, onDragEnd) {

  window.threekit.player.tools.addTool({
    key: 'tkwalldrag',
    active: true,
    enabled: true,
    handlers: {
      hover: async (ev) => {
        if (doesHitWallItem(ev.hitNodes, wallAssets)) {
          const node = ev.hitNodes[0].hierarchy[1]
          window.threekit.player.selectionSet.setStyle({ outlineColor: 'yellow' });
          window.threekit.player.selectionSet.set([node.nodeId])
        } else if (doesHitRail(ev.hitNodes, wallAssets)) {
          const node = ev.hitNodes[0].hierarchy[1]
          const isMovable = canRailNodeMove(node.nodeId, grid)
          if (isMovable) {
            window.threekit.player.selectionSet.setStyle({ outlineColor: 'yellow' });
          } else {
            window.threekit.player.selectionSet.setStyle({ outlineColor: 'gray' });
          }
          window.threekit.player.selectionSet.set([node.nodeId])
        } else {
          window.threekit.player.selectionSet.set([])
        }
      },
      drag: (ev) => {
        let dragEvent = null
        let node = null
        let itemX, itemY, itemSizes
        let lastEvent = ev
        if (doesHitWallItem(ev.hitNodes, wallAssets)) {
          dragEvent = 'item'
          node = ev.hitNodes[0].hierarchy[1]

          const item = wallAssets.find(el => el.id === node.name)

          itemX = item.sizes.x
          itemY = item.sizes.y
          itemSizes = item.sizes

        } else if (doesHitRail(ev.hitNodes, wallAssets)) {
          dragEvent = 'rail'
          node = ev.hitNodes[0].hierarchy[1]
        }

        return {
          handle: async (currentEvent) => {
            if (!node) return
            lastEvent = currentEvent
            if (!currentEvent.hitNodes.length) {
              window.threekit.player.selectionSet.setStyle({ outlineColor: 'red' });
              
              const isRailMovable = canRailNodeMove(node?.nodeId, grid)
              if (dragEvent === 'rail' && !isRailMovable) {
                if (onHoverOffBounds) onHoverOffBounds(false)
              } else if (onHoverOffBounds) {
                onHoverOffBounds(true)
              }
              
              return false
            } else {
              window.threekit.player.selectionSet.setStyle({ outlineColor: 'yellow' });
              if (onHoverOffBounds) onHoverOffBounds(false)
            }
            if (dragEvent === 'rail') {
              const isMovable = canRailNodeMove(node.nodeId, grid)

              if (!isMovable) {
                window.threekit.player.selectionSet.set([])
                return false
              }

              const currentIntersection = currentEvent.hitNodes.pop()?.intersection

              const gridPoint = grid.flat().find(el => currentIntersection.x >= el.min.x && currentIntersection.x <= el.max.x && currentIntersection.y >= el.min.y && currentIntersection.y <= el.max.y)

              if (!gridPoint) return false

              const slotGrid = grid.flat().filter(el => el.slot == gridPoint.slot)

              const [gridY, gridX] = gridPoint.id.split('-').map(el => parseInt(el))

              grid.flat().filter(el => el.rail == node.nodeId).forEach(el => { el.rail = 'transit' })

              if (!gridPoint.rail && gridPoint.rail !== 'transit') {

                const newTranslation = {
                  x: slotGrid[0].min.x,
                  y: slotGrid[0].min.y,
                  z: RAIL_POSITION_Z
                }

                grid.flat().filter(el => el.rail == 'transit').forEach(el => { el.rail = null })
                positionModel(node.nodeId, newTranslation)
                slotGrid.forEach(el => el.rail = node.nodeId)

                freezeGridRail(grid)
              } else {
                grid.flat().filter(el => el.rail == 'transit').forEach(el => { el.rail = node.nodeId })
              }

            } else if (dragEvent === 'item') {
              const currentIntersection = currentEvent.hitNodes.pop().intersection

              const gridPoint = grid.flat().find(el => currentIntersection.x >= el.min.x && currentIntersection.x <= el.max.x && currentIntersection.y >= el.min.y && currentIntersection.y <= el.max.y)

              if (!gridPoint) return false

              if (gridPoint.rail) {

                const prevItemGrid = grid.flat().filter(el => el.item == node.nodeId)
                const prevSafeBoxGrid = grid.flat().filter(el => el.safeBox == node.nodeId)
                prevItemGrid.forEach(el => { el.item = 'transit' })
                prevSafeBoxGrid.forEach(el => { el.safeBox = 'transit' })

                const gridSpaceBox = getGridSpaceForItem(grid, gridPoint, itemSizes)

                if (gridSpaceBox) {
                  const { itemGrid, safeBoxGrid } = gridSpaceBox
                  const newTranslation = {
                    x: gridPoint.min.x,
                    y: gridPoint.min.y,
                    z: ITEM_POSITION_Z
                  }
                  prevItemGrid.forEach(el => { el.item = null })
                  prevSafeBoxGrid.forEach(el => { el.safeBox = null })
                  positionModel(node.nodeId, newTranslation)
                  itemGrid.forEach(el => el.item = node.nodeId)
                  safeBoxGrid.forEach(el => el.safeBox = node.nodeId)
                } else {
                  prevItemGrid.forEach(el => { el.item = node.nodeId })
                  prevSafeBoxGrid.forEach(el => { el.safeBox = node.nodeId })
                }

              }
            }
            // console.log(grid)
            // console.log(grid.flat().filter(el => el.safeBox).length)
          },
          onEnd: () => {
            if (lastEvent && !lastEvent.hitNodes.length && node) {
              if (dragEvent === 'rail') {
                const isMovable = canRailNodeMove(node.nodeId, grid)
                if (!isMovable) return
              }
              removeWallItemById(node.nodeId, grid)
              if (onDeleteNode) onDeleteNode(node.nodeId)
            }
            if (onHoverOffBounds) onHoverOffBounds(false)
            saveGlobalState(grid)
          }
        }
      }
    }
  })
}

function addMobileDragTool(stack, mobileAssets, onDeleteNode, onHoverOffBounds) {
  window.threekit.player.tools.addTool({
    key: 'tkmobiledrag',
    active: true,
    enabled: true,
    handlers: {
      hover: async (ev) => {
        if (doesHistLastInMobileStack(ev.hitNodes, mobileAssets, stack)) {
          const node = ev.hitNodes[0].hierarchy[2]
          window.threekit.player.selectionSet.setStyle({ outlineColor: 'yellow' });
          window.threekit.player.selectionSet.set([node.nodeId])
        } else {
          window.threekit.player.selectionSet.set([])
        }
      },
      drag: (ev) => {
        let dragEvent = null
        let node = null
        let lastEvent = ev
        if (doesHistLastInMobileStack(ev.hitNodes, mobileAssets, stack)) {
          dragEvent = 'item'
          node = ev.hitNodes[0].hierarchy[2]

          const item = mobileAssets.find(el => el.id === node.name)
        }
        return {
          handle: (currentEvent) => {
            if (!node) return
            lastEvent = currentEvent
            if (!currentEvent.hitNodes.length) {
              window.threekit.player.selectionSet.setStyle({ outlineColor: 'red' });
              if (onHoverOffBounds) onHoverOffBounds(true)
              return false
            } else {
              window.threekit.player.selectionSet.setStyle({ outlineColor: 'yellow' });
              if (onHoverOffBounds) onHoverOffBounds(false)
            }
          },
          onEnd: async () => {
            if (lastEvent && !lastEvent.hitNodes.length && node) {
              await removeMobileItemById(node.nodeId, stack)
              if (onDeleteNode) onDeleteNode(node.nodeId)
            }
            if (onHoverOffBounds) onHoverOffBounds(false)
          }
        }
      }
    }
  })
}

function removeAllTools() {
  window.threekit.player.tools.removeTools(['tkmobiledrag', 'tkwalldrag'])
}

function makeGrid(x, y) {
  const configuration = window.threekit.configurator.getConfiguration()
  
  x = x || configuration['Wall Width']
  y = y || configuration['Wall Height']

  const grid = []
  let slotCounter = 0
  let rowX = 0
  let rowY = 0
  for (let i = 0; i < y; i += STEP_Y) {
    for (let ii = 0; ii < x; ii += STEP_X) {
      if (!grid[rowY]) {
        grid[rowY] = []
      }
      grid[rowY][rowX] = {
        id: `${rowY}-${rowX}`,
        min: {
          x: ii,
          y: i
        },
        max: {
          x: ii + STEP_X,
          y: i + STEP_Y
        },
        rail: null,
        item: null,
        safeBox: null,
        blocked: false,
        slot: 'slot-' + rowY + '-' + Math.floor(rowX / NODE_PER_RAIL)
      }
      slotCounter++
      rowX++
    }
    rowY++
    rowX = 0
  }
  return grid
}

function updateGrid(grid, onDeleteNode, wallSize = {}) {

  const newGrid = makeGrid(wallSize.x, wallSize.y)

  const nodesToDelete = new Set()
  const yMatrixLength = grid.length - newGrid.length > 0 ? grid.length : newGrid.length
  const xMatrixLength = grid[0].length - newGrid[0].length > 0 ? grid[0].length : newGrid[0].length

  for (let i = 0; i < yMatrixLength; i++) {
    for (let ii = 0; ii < xMatrixLength; ii++) {
      if (grid[i] && grid[i][ii]) {
        if (newGrid[i] && newGrid[i][ii]) {
          newGrid[i][ii] = {...grid[i][ii]}
        } else {
          nodesToDelete.add(grid[i][ii].rail)
          nodesToDelete.add(grid[i][ii].item)
        }
      }
    }
  }
  
  freezeGridRail(newGrid)

  const handingNodes = newGrid.flat().filter(el => el.blocked && el.item).map(el => el.item)

  const allAffectedNodes = [...[...nodesToDelete].filter(el => el), ...handingNodes]
  
  if (allAffectedNodes.length) return false

  allAffectedNodes.forEach(el => {
    removeWallItemById(el, grid)
    if (onDeleteNode) onDeleteNode(el)
  })

  return newGrid
}

function makeStack() {
  return []
}

async function addMobileItemById(itemId, mobileAssets, stack) {

  const item = mobileAssets.find(item => item.id === itemId)

  if (!stack.length && item.assetType !== 'base') return
  if (stack.length > 6) return

  if (stack.length && !stack[stack.length - 1].allowed.includes(item.id)) return

  const itemConfiguration = {
    'Model': { assetId: item.id }
  }

  const baseMobileId = getNodeIdByQuery({
    name: 'Base--Mobile'
  })


  const initialTranslation = {
    x: 0,
    y: 0 + stack.reduce((sum, cur) => sum + cur.sizes.y, 0),
    z: 0
  }

  const nodeId = addModel(ITEM_MOBILE_ID, item.id, { translation: initialTranslation, configuration: itemConfiguration }, baseMobileId)

  if (nodeId) {
    stack.push({ ...item, nodeId })
    if (item.assetType === 'base') {
      await setSceneConfig({
        'Is Mobile Storage Visible': false
      })
    }
  }

  return nodeId
}

async function saveGlobalState(grid, stack, wallItems, mobileItems, configuratorView) {
  const configuration = window.threekit.configurator.getConfiguration()
  if (configuration.Global) {
    const parsed = JSON.parse(configuration.Global)
    grid = grid || parsed.grid
    stack = stack || parsed.stack
    wallItems = wallItems || parsed.wallItems
    mobileItems = mobileItems || parsed.mobileItems
    configuratorView = configuratorView || parsed.configuratorView
  }
  await setSceneConfig({
    ...configuration,
    'Global': JSON.stringify({
      grid,
      stack,
      wallItems,
      mobileItems,
      configuratorView
    })
  })
  return true
}

async function shareGlobalState() {
  const lastConfiguration = window.threekit.configurator.getConfiguration()
  const savedConfigResponse = await window.threekit.controller.saveConfiguration({ ...lastConfiguration, force: true })
  return savedConfigResponse
}

async function loadGlobalState(wallAssets, mobileAssets, configId) {
  const configuration = configId ? await window.threekit.controller.resumeConfiguration(configId) : window.threekit.configurator.getConfiguration()
  const { 'Global': globalString, 'Wall Height': wallHeight, 'Wall Width': wallWidth } = configuration.variant || configuration

  if (!globalString) {
    return { grid: makeGrid(), stack: makeStack(), wallItems: [], mobileItems: [], wallHeight, wallWidth, configuratorView: null }
  }

  const { grid, stack, wallItems, mobileItems, configuratorView } = JSON.parse(globalString)

  const wallHandlers = {
    rail: (rail) => {
      const railGrid = grid.flat().filter(el => el.rail === rail.nodeId)

      const initialTranslation = {
        x: railGrid[0].min.x,
        y: railGrid[0].min.y,
        z: RAIL_POSITION_Z
      }

      const itemConfiguration = {
        Model: { assetId: RAIL_WALL_ID },
      }

      const nodeId = addModel(ITEM_WALL_ID, RAIL_WALL_ID, { translation: initialTranslation, configuration: itemConfiguration })

      rail.nodeId = nodeId

      railGrid.forEach(el => { el.rail = nodeId })
    },
    item: (item) => {
      const itemGrid = grid.flat().filter(el => el.item === item.nodeId)
      const safeBoxGrid = grid.flat().filter(el => el.safeBox === item.nodeId)

      const initialTranslation = {
        x: itemGrid[0].min.x,
        y: itemGrid[0].min.y,
        z: ITEM_POSITION_Z
      }

      const itemConfiguration = {
        Model: { assetId: item.itemId },
      }

      const nodeId = addModel(ITEM_WALL_ID, item.itemId, { translation: initialTranslation, configuration: itemConfiguration })

      item.nodeId = nodeId

      itemGrid.forEach(el => { el.item = nodeId })
      safeBoxGrid.forEach(el => { el.safeBox = nodeId })
    }
  }

  wallItems.forEach(item => {
    wallHandlers[wallAssets.find(el => el.id === item.itemId).assetType](item)
  })

  mobileItems.forEach((item, index) => {
    const itemConfiguration = {
      'Model': { assetId: item.itemId }
    }

    const baseMobileId = getNodeIdByQuery({
      name: 'Base--Mobile'
    })[0]

    const tempStack = stack.slice(0, index)

    const initialTranslation = {
      x: 0,
      y: 0 + tempStack.reduce((sum, cur) => sum + cur.sizes.y, 0),
      z: 0
    }

    const nodeId = addModel(ITEM_MOBILE_ID, item.itemId, { translation: initialTranslation, configuration: itemConfiguration }, baseMobileId)

    item.nodeId = nodeId
    stack[index].nodeId = nodeId
  })

  return { grid, stack, wallItems, mobileItems, wallHeight, wallWidth, configuratorView }
}

function resetGlobalState(wallAssets, mobileAssets, wallItems, mobileItems) {
  [...wallItems.map(el => el.nodeId), ...mobileItems.map(el => el.nodeId)].forEach(el => {
    removeModel(el)
  })
  return loadGlobalState(wallAssets, mobileAssets, INIT_CONFIG_ID)
}

async function resetWallGrid(grid, wallSize) {
  grid.flat().map(({rail, item}) => ([rail, item])).flat().forEach(el => {
    if (el) removeModel(el)
  })
  await window.threekit.player.evaluate()
  return {
    grid: makeGrid(wallSize.x, wallSize.y),
  }
}

async function resetMobileStack(stack) {
  stack.forEach((el, index) => {
    removeModel(el.nodeId)
  })
  setSceneConfig({
    'Is Mobile Storage Visible': true
  })
  await window.threekit.player.evaluate()
  return {
    stack: makeStack(),
  }
}

async function setSceneConfig(config) {
  const configurator = await window.threekit.player.getConfigurator()
  configurator.setConfiguration(config)
  await window.threekit.player.evaluate()
}

function lockCamera() {
  window.threekit.player.tools.removeTool('orbit')
}

async function focusOnWall() {
  await window.threekit.player.evaluate()
  window.threekit.player.camera.frameBoundingSphere(window.threekit.player.scene.find({ name: 'Base--Wall' }), {
    x: 0,
    y: 0,
    z: -0.5,
  })
}

async function focusOnMobile() {
  await window.threekit.player.evaluate()
  window.threekit.player.camera.frameBoundingSphere(window.threekit.player.scene.find({ name: 'Base--Mobile' }), {
    x: 0,
    y: 0,
    z: -0.5,
  })
}

export {
  lockCamera,
  focusOnMobile,
  focusOnWall,
  addMobileDragTool,
  addMobileItemById,
  addWallDragTool,
  addWallItemById,
  removeWallItemById,
  removeMobileItemById,
  removeAllTools,
  updateGrid,
  makeGrid,
  makeStack,
  addWallRail,
  setSceneConfig,
  saveGlobalState,
  shareGlobalState,
  loadGlobalState,
  resetGlobalState,
  resetWallGrid,
  resetMobileStack
}
