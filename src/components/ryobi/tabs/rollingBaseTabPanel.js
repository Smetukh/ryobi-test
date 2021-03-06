import React from 'react';

import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from "@mui/icons-material/Refresh";
import ItemModal from '../Modal/ItemModal';

const RollingBaseTabPanel = ({
  TabPanel,
  value,
  fullHeightClass,
  handleMobileClick,
  onDragStart,
  setId,
  isMobile,
  setEnabled,
  setNotifyModal,
  index,
  withMobileItemAddRejection,
  rollingBase,
  addMobileItemById,
  mobileItems,
  rollingBaseItem,
  wallInMobileItems,
  displayItems,
  addFromWallToMobile,
  setIntoNextStep,
  enabled
}) => {
    return (
        <TabPanel value={value} index={index} className={"reduce-padding card-body-content " + fullHeightClass}>
        <div className="tab-pane" id="mobile_build" role="tabpanel">
          <div className='top_product_area dashed_border-bottom mobile_bulder row m-0 top_products_intro'>
            <h6 className="font-size-small  d-block col-sm-12 ">
              Rolling Base
            </h6>
            <div className="base-mobile-item-container" onClick={handleMobileClick}>
              <img src={rollingBase[0].imageName} alt="" className="100%" onClick={() => withMobileItemAddRejection(async () => addMobileItemById(rollingBase[0].id))} />
              <div className="base-item-overlay base-mobile-item-overlay">
                <div className="plus-add">
                  <AddIcon className="fa-plus" />
                </div>
                <img
                  src={rollingBase[0].imageName}
                  alt="img"
                  onClick={() => {
                    withMobileItemAddRejection(async () => addMobileItemById(rollingBase[0].id));
                    setId(rollingBase[0].itemName);
                    if (enabled) {
                      setIntoNextStep();
                    }
                  }}
                  onDragStart={onDragStart}
                />
                <div className="cardButtons">
                  <div className="addButton" onClick={
                    () => {
                      withMobileItemAddRejection(async () => addMobileItemById(rollingBase[0].id))
                      setId(rollingBase[0].itemName)
                      if (enabled) {
                        setIntoNextStep();
                      }
                    }
                  }><AddCircleIcon />add</div>
                  <ItemModal
                    className="addButton infoButton"
                    itemName={rollingBase[0].itemName}
                    storeSku={rollingBase[0].storeSku}
                    internetNumber={rollingBase[0].internetNumber}
                    subitemName={rollingBase[0].subitemName}
                    subItems={rollingBase[0].subItems}
                    description={rollingBase[0].description}
                    learn={rollingBase[0].learn}
                    buy={rollingBase[0].buy}
                    addAction={() => withMobileItemAddRejection(async () => addMobileItemById(rollingBase[0].id))}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="products_area pt-3">
            <div className="products_block">
            <div className="row  margin_removed pb-2">
              {!mobileItems.length && <div className="item-block-overlay">Please select the Base to get started with your Mobile Build.</div>}
              {rollingBaseItem.map((rolling, i) => (
                <div
                  className="col-sm-4 col-6"
                  key={rolling.id}
                >
                  <div className="product_info" onClick={handleMobileClick}>
                    <div className="plus-add">
                      <AddIcon className="fa-plus" />
                    </div>
                    <img
                      src={rolling.imageName}
                      alt="img"
                      className="w-100"
                      onClick={() => {
                        withMobileItemAddRejection(async () => addMobileItemById(rolling.id));
                        setId(rolling.itemName);
                        if (enabled) {
                          setIntoNextStep();
                        }
                      }}
                      onDragStart={onDragStart}
                      draggable='true' id={rolling.id}
                    />
                    <div className="cardButtons">
                      <div className="addButton" onClick={
                        () => {
                          withMobileItemAddRejection(async () => addMobileItemById(rolling.id))
                          setId(rolling.itemName)
                          if (enabled) {
                            setIntoNextStep();
                          }
                        }
                      }><AddCircleIcon />add</div>
                      <ItemModal
                        className="addButton infoButton"
                        itemName={rollingBase[0].itemName}
                        storeSku={rolling.storeSku}
                        internetNumber={rolling.internetNumber}
                        subitemName={rolling.subitemName}
                        subItems={rolling.subItems}
                        description={rolling.description}
                        learn={rolling.learn}
                        buy={rolling.buy}
                        addAction={() => withMobileItemAddRejection(async () => addMobileItemById(rolling.id))}
                        isMobile={isMobile}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!!wallInMobileItems.length &&
              <div className="row  margin_removed dashed_border-top pt-3">
                <h6 className="font-size-small d-block col-sm-12 pb-4">
                  Use for Mobile Build
                </h6>
                {
                  wallInMobileItems.map(el => ({ ...el, ...displayItems.find(el2 => el2.id === el.itemId) }))
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
                            onClick={() => withMobileItemAddRejection(async () => addFromWallToMobile(item.id))}
                          />
                        </div>
                      </div>
                    ))}
              </div>}
            </div>
          </div>
          {!isMobile && 
            <div onClick={() => setEnabled(true)} className="add_products_btn show_tour_btn">
              show tour
            </div>
          }
          <div className="reset font-size-small" style={{ opacity: mobileItems.length ? 1 : 0.5 }}>
            <div onClick={() => mobileItems.length ? setNotifyModal('resetMobile') : null} style={{ cursor: mobileItems.length ? 'pointer' : 'default' }}>
              <h6 className="font-size-small align-items-center d-flex">
                <RefreshIcon /> Reset Mobile Storage build
              </h6>
            </div>
          </div>
        </div>
      </TabPanel>
    )
}

export default RollingBaseTabPanel;