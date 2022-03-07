function positionModel(nodeId, translation) {
  window.threekit.player.scene.set(
    { id: nodeId, plug: 'Transform', property: 'translation' },
    translation
  )
}

function rotateModel(nodeId, rotation) {
  window.threekit.player.scene.set(
    { id: nodeId, plug: 'Transform', property: 'rotation' },
    rotation
  )
}

function removeModel(nodeId) {
  window.threekit.player.scene.deleteNode(nodeId)
}

function addModel(
  assetId,
  name,
  { translation, rotation, scale, configuration = {}, meta }={},
  bindToNodeId = window.threekit.player.instanceId
) {
  return window.threekit.player.scene.addNode(
    {
      name,
      type: 'Model',
      plugs: {
        Null: [{ type: 'Model', asset: { assetId, configuration } }],
        Transform: [{ type: 'Transform', translation, rotation, scale }],
        // Properties: [
        //   { type: 'ModelProperties', visible: true },
        //   { type: 'MetaData', key: meta.key, value: meta.value },
        // ],
      },
    },
    bindToNodeId
  )
}

function centerCameraOnName(name) {
  window.threekit.player.camera.frameBoundingSphere(
    window.threekit.player.scene.filter({
      name,
    }),
    {
      x: -1,
      y: -1,
      z: -1,
    }
  )
}

function getRotationForNodeId(nodeId) {
  return window.threekit.player.scene.get({
    id: nodeId,
    plug: 'Transform',
    property: 'rotation',
  })
}

function getTranslationForNodeId(nodeId) {
  return window.threekit.player.scene.get({
    id: nodeId,
    plug: 'Transform',
    property: 'translation',
  })
}

export { positionModel, addModel, removeModel, centerCameraOnName, rotateModel, getRotationForNodeId, getTranslationForNodeId }
