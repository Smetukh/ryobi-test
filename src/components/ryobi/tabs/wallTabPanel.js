import React from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from "@mui/icons-material/Refresh";
import ItemModal from '../Modal/ItemModal';

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
  index
}) => {
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
                onClick={() => { withWallItemAddRejection(addWallRail) }}
              />
              <div className="base-item-overlay base-wall-item-overlay" onClick={handleMobileClick}>
                <div className="plus-add">
                  <AddIcon className="fa-plus" />
                </div>
                <div onClick={() => { withWallItemAddRejection(addWallRail) }}>
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
                    }
                  }><AddCircleIcon />add</div>
                  <ItemModal
                    className="addButton infoButton"
                    itemName="INFO"
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

          <div className="wall_products">
          <div className="products_area">
            <div className="row  margin_removed" style={{ position: 'relative' }}>
              {wallBuild.map((wall, i) => (
                <div
                  className="col-sm-4 col-6"
                  key={i.toString()}
                >
                  <div className="product_info" onClick={handleMobileClick}>
                    <div className="plus-add">
                      <AddIcon className="fa-plus" />
                    </div>
                    <div
                      onClick={() => {
                        withWallItemAddRejection(async () => addWallItemById(wall.id))
                        setId(wall.itemName)
                      }}>
                      <img
                        src={wall.imageName}
                        alt="img"
                        className="w-100"
                        draggable='true' id={wall.id} onDragStart={onDragStart}
                      />
                    </div>
                    <div className="cardButtons">
                      <div className="addButton" onClick={
                        () => {
                          withWallItemAddRejection(async () => addWallItemById(wall.id))
                          setId(wall.itemName)
                        }
                      }><AddCircleIcon />add</div>
                      <ItemModal
                        className="addButton infoButton"
                        itemName="INFO"
                        storeSku={wall.storeSku}
                        internetNumber={wall.internetNumber}
                        subitemName={wall.subitemName}
                        subItems={wall.subItems}
                        description={wall.description}
                        learn={wall.learn}
                        buy={wall.buy}
                        addAction={async () => {
                          withWallItemAddRejection(async () => addWallItemById(wall.id))
                        }}
                        isMobile={isMobile}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!!mobileInWallItems.length && 
            <div className="row  margin_removed dashed_border-top pt-3">
              <h6 className="font-size-small d-block col-sm-12 pb-4">
                Use for Wall Build
              </h6>
              {
                mobileInWallItems.map(el => ({...el, ...displayItems.find(el2 => el2.id === el.itemId )}) )
                .map((item, i) => (
                <div
                  className="col-sm-4 col-6"
                  key={i.toString()}
                >
                  <div className="product_info">
                    <img
                      src={item.imageName}
                      alt="img"
                      className="w-100"
                      onClick={() => withWallItemAddRejection(async () => addFromMobileToWall(item.id))}
                    />
                  </div>
                </div>
              ))}
            </div>
            }{!!mobileInWallItems.length &&
              <div className="row  margin_removed dashed_border-top pt-3">
                <h6 className="font-size-small d-block col-sm-12 pb-4">
                  Use for Wall Build
                </h6>
                {
                  mobileInWallItems.map(el => ({ ...el, ...displayItems.find(el2 => el2.id === el.itemId) }))
                    .map((item, i) => (
                      <div
                        className="col-sm-4 col-6"
                        key={i.toString()}
                      >
                        <div className="product_info" onClick={handleMobileClick}>
                          <img
                            src={item.imageName}
                            alt="img"
                            className="w-100"
                            onClick={() => withWallItemAddRejection(async () => addFromMobileToWall(item.id))}
                          />
                          <div className="cardButtons">
                            <div className="addButton"><AddCircleIcon />add</div>
                            <ItemModal
                              className="addButton infoButton"
                              itemName="INFO"
                              storeSku={item.storeSku}
                              internetNumber={item.internetNumber}
                              subitemName={item.subitemName}
                              subItems={item.subItems}
                              description={item.description}
                              learn={item.learn}
                              buy={item.buy}
                              addAction={() => withWallItemAddRejection(async () => addFromMobileToWall(item.id))}
                              isMobile={isMobile}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
              </div>}
          </div>
          </div>
          <div onClick={() => setEnabled(true)} className="add_products_btn show_tour_btn">
            show tour
          </div>
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