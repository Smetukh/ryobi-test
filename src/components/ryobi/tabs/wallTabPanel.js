import React from 'react';

import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from "@mui/icons-material/Refresh";
import ItemModal from '../Modal/ItemModal';
import ProductsArea from '../productsArea/ProductsArea';

const CustomTabPanel = ({
  TabPanel,
  value,
  fullHeightClass,
  wallSizes,
  withWallSizeChangeRejection,
  setWallWidth,
  setWallHeight,
  wallWidth,
  wallHeight,
  wall,
  withWallItemAddRejection,
  addWallRail,
  handleMobileClick,
  onDragStart,
  setId,
  isMobile,
  wallBuild,
  addWallItemById,
  mobileInWallItems,
  displayItems,
  addFromMobileToWall,
  setEnabled,
  wallItems,
  setNotifyModal,
  index,
  enabled,
  setIntoNextStep
}) => {
  const productsAreaProps = {
    wallBuild,
    handleMobileClick,
    withWallItemAddRejection,
    addWallItemById,
    setId,
    enabled,
    setIntoNextStep,
    onDragStart,
    isMobile,
    mobileInWallItems,
    displayItems,
    addFromMobileToWall
  }
  return (
    <TabPanel
      value={value}
      index={index}
      className={
        "reduce-padding card-body-content " + fullHeightClass
      }
    >
        <div className="tab-pane" id='wall_build' role="tabpanel">
          <div className="tab-sec">
            <div className="tab-col1">
              <span className="font-size-small">Wall Size</span>
            </div>
            <div className="tab-col2">
              <div className="tab-col2-inner">

                <select className="form-control form-control-sm" onChange={(e) => withWallSizeChangeRejection(() => setWallWidth(wallSizes.width.find(el => el.m === parseFloat(e.target.value))))} value={wallSizes.width.find(el => wallWidth === el.m).m}>
                  {wallSizes.width.map(el =>
                    <option key={el.m} value={el.m}>{el.ft}'</option>
                  )}
                </select>
                <label>Wide</label>
              </div>
              <div className="tab-col2-inner">
                <span>x</span>
              </div>
              <div className="tab-col2-inner">
                <select className="form-control form-control-sm" onChange={(e) => withWallSizeChangeRejection(() => setWallHeight(wallSizes.height.find(el => el.m === parseFloat(e.target.value))))} value={wallSizes.height.find(el => wallHeight === el.m).m}>
                  {wallSizes.height.map(el =>
                    <option key={el.m} value={el.m}>{el.ft}'</option>
                  )}
                </select>
                <label>Tall</label>
              </div>
            </div>
          </div>

          <div className='row border-add margin_removed align-center base-wall-mobile top_products_intro'>
            <div className="col-6">
              <span className="d-block font-size-small">
                Wall Base
              </span>
            </div>
            <div className="col-6" style={{ position: 'relative' }}>
              <img
                src={wall[0].imageName}
                alt="img"
                className="top-single-img"
                onClick={() => {
                  withWallItemAddRejection(addWallRail);
                  if (enabled) {
                    setIntoNextStep();
                  }
                }}
              />
              <div className="base-item-overlay base-wall-item-overlay" onClick={handleMobileClick}>
                <div className="plus-add">
                  <AddIcon className="fa-plus" />
                </div>
                <div onClick={() => {
                  withWallItemAddRejection(addWallRail);
                  if (enabled) {
                    setIntoNextStep();
                  }
                }}>
                  <img
                    src={wall[0].imageName}
                    alt="img"
                    className="top-single-img"
                    draggable='true' id={null} onDragStart={onDragStart}
                  />
                </div>
                <div className="cardButtons">
                  <div className="addButton" onClick={
                    async () => {
                      withWallItemAddRejection(addWallRail)
                      setId(wall[0].itemName)
                      if (enabled) {
                        setIntoNextStep();
                      }
                    }
                  }><AddCircleIcon />add</div>
                  <ItemModal
                    className="addButton infoButton"
                    itemName={wall[0].itemName}
                    storeSku={wall[0].storeSku}
                    internetNumber={wall[0].internetNumber}
                    subitemName={wall[0].subitemName}
                    subItems={wall[0].subItems}
                    description={wall[0].description}
                    learn={wall[0].learn}
                    buy={wall[0].buy}
                    addAction={async () => withWallItemAddRejection(addWallRail)}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </div>
          </div>
          <ProductsArea { ...productsAreaProps } />
          {!isMobile &&
            <div onClick={() => setEnabled(true)} className="add_products_btn show_tour_btn">
              show tour
            </div>
          }
          <div className="reset font-size-small" style={{ opacity: wallItems.length ? 1 : 0.5 }}>
            <div onClick={() => wallItems.length ? setNotifyModal('resetWall') : null} style={{ cursor: wallItems.length ? 'pointer' : 'default' }}>
              <h6 className="font-size-small align-items-center d-flex">
                <RefreshIcon /> Reset Wall build
              </h6>
            </div>
          </div>
        </div>
      </TabPanel>
    )
}

export default CustomTabPanel;