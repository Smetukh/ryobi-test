import React, { useState, useEffect, useContext } from "react";
import BuyNowModal from "./Modal/BuyNowModal";
import ShareModal from "./Modal/ShareModal";
import ItemModal from "./Modal/ItemModal";
import FoundIssueModal from "./Modal/FoundIssueModal";
import ResetModal from "./Modal/ResetModal";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import Header from "./header";
import Snackbar from '@mui/material/Snackbar';
import { useMediaQuery } from 'react-responsive'
import ListSubheader from '@mui/material/ListSubheader';

import CancelIcon from '@mui/icons-material/Cancel';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  wall,
  wallBuild,
  rollingBaseItem,
  rollingBase,
  mobileBuild,
} from "./constant";

import messages from './messages.js'

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress';

import Player from "../../configurator/components/player"
import { ConfiguratorContext } from '../../configurator/store/'
import { Alert } from "@mui/material";
import CustomTabs from "./tabs/tabs";

const displayItems = [...wall, ...wallBuild, ...rollingBase, ...rollingBaseItem]

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function Ryobi() {

  const {
    configuratorStore,
    playerStore,
    dataStore
  } = useContext(ConfiguratorContext)

  const {
    configuratorView,
    setFocusOnMobile,
    setFocusOnWall,
    addWallRail,
    addWallItemById,
    addMobileItemById,
    addFromWallToMobile,
    addFromMobileToWall,
    shareGlobalState,
    resetGlobalState,
    resetWallState,
    resetMobileState,
    wallHeight,
    wallWidth,
    setWallWidth,
    setWallHeight,
    wallItems,
    mobileItems,
    allConfiguratorItems,
    wallInMobileItems,
    mobileInWallItems,
    isAboutToDelete
  } = configuratorStore

  const {
    wallSizes,
  } = dataStore

  const {
    assetLoadingState,
    isPlayerReady
  } = playerStore

  const [notifyModal, setNotifyModal] = useState('welcome')
  // const [issueModalOpen, setIssueModalOpen] = useState(true)

  const withWallSizeChangeRejection = async (addHandler) => {
    if (!(await addHandler())) {
      setNotifyModal('destructiveWallSize')
    }
  }

  const withWallItemAddRejection = async (addHandler) => {
    if (!(await addHandler())) {
      setNotifyModal('noSpaceWall')
    } else {
      handleClickBar();
      handleMobileClick();
    }
  }

  const withMobileItemAddRejection = async (addHandler) => {
    if (!(await addHandler())) {
      setNotifyModal('noSpaceMobile')
    }
  }

  const selectionItems = allConfiguratorItems
    .map(item => ({ ...item, ...displayItems.find(el => el.id === item.id) }))

  const [fullHeightClass, fullHeightClick] = useState("");
  const [closeIconClass, closeIconClick] = useState("");

  const [value, setValue] = React.useState(0);
  useEffect(() => {
    setValue(configuratorView === 'wall' ? 0 : 1)
  }, [configuratorView])

  function handleChange(event, newValue) {
    const viewHandlers = [setFocusOnWall, setFocusOnMobile]
    viewHandlers[newValue]()
    setValue(newValue);
  }

  //Begin::Tab Content Show or Hide
  function handleClick() {
    fullHeightClick("full-height");
    closeIconClick("close_icon_added");
  }

  function handleMobileClick() {
    fullHeightClick();
    closeIconClick();
  }
  //End::Tab Content Show or Hide

  const [open, setOpen] = React.useState(false);
  const [id, setId] = useState('');
  const [move, setMove] = useState(0);
  const [touchStart, setTouchStart] = useState(0)
  const [scrollY, setScrollY] = useState(0);
  const handleClickBar = () => {
    setOpen(true);
  };

  const scroll = () => {
    setScrollY(window.pageYOffset);
  }

  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", scroll);
    }
    watchScroll();
    return () => {
      window.removeEventListener("scroll", scroll);
    };
  });

  const handleCloseBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const onTouchStart = (e) => { setTouchStart(e.changedTouches[0].pageY) }

  const onTouchMove = (e) => { setMove(e.changedTouches[0].pageY - touchStart); }

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  const scrollUpClick = () => { window.scrollTo(0, 0) }

  const scrollDownClick = (e) => { window.scrollTo(0, e.screenX) }

  const onDragStart = (event) => {
    const data = JSON.stringify({ wallId: event.target.id });
    event.dataTransfer.setData('data', data);
    event.dataTransfer.setDragImage(event.target, (0.5 * event.target.clientWidth), (0.5 * event.target.clientWidth));
  };

  const onDragOver = (e) => { e.preventDefault(); }
  
  const onDrop = async (e) => {
    const { wallId } = JSON.parse(e.dataTransfer.getData("data"));
    !!wallId ? withWallItemAddRejection(async () => addWallItemById(wallId)) : withWallItemAddRejection(async () => addWallRail());    
  }

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} move={move}>
      <FoundIssueModal open={notifyModal === 'welcome'} setOpen={setNotifyModal} messagePayload={messages.welcome} />
      <FoundIssueModal open={notifyModal === 'noSpaceWall'} setOpen={setNotifyModal} messagePayload={messages.noSpaceWall} />
      <FoundIssueModal open={notifyModal === 'noSpaceMobile'} setOpen={setNotifyModal} messagePayload={messages.noSpaceMobile} />
      <FoundIssueModal open={notifyModal === 'destructiveWallSize'} setOpen={setNotifyModal} messagePayload={messages.destructiveWallSize} />
      <ResetModal open={notifyModal === 'resetWall'} setOpen={setNotifyModal} messagePayload={messages.resetWall} onConfirm={resetWallState} />
      <ResetModal open={notifyModal === 'resetMobile'} setOpen={setNotifyModal} messagePayload={messages.resetMobile} onConfirm={resetMobileState} />

      <div className={`main_wrapper`} style={{ pointerEvents: move > 150 ? 'none' : 'all' }}>
        <div className="container custom-container">
          <div className="row">
            <div className={isPlayerReady ? "col-lg-8": "col-lg-12"}>
              {isMobile && <span onClick={() => scrollUpClick()} style={{ position: 'fixed', right: '0', top: '20px', zIndex: '10', visibility: scrollY < 115 ? 'hidden' : 'visible', backgroundColor: '#f3f3f3', borderRadius: '50%' }}><ArrowUpwardIcon style={{color: 'grey'}} fontSize='large'/></span>}
              {isMobile && <span onClick={scrollDownClick} style={{ position: 'fixed', right: '0', bottom: '10%', zIndex: '10', backgroundColor: '#f3f3f3', borderRadius: '50%' }}><ArrowDownwardRoundedIcon style={{color: 'grey'}} fontSize='large'/></span>}
              {!isMobile && <Header />}
              {isMobile &&
                <>
                  <Snackbar open={open} autoHideDuration={1500} onClose={handleCloseBar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                      {id} successfuly added to your build
                    </Alert>
                  </Snackbar>
                  <Header />
                  <ListSubheader>
                    <div className="col-lg-4  mobile_style">
                      <div className="configurator_area">
                        <div className="card">
                          <div className="card-header">
                            <CustomTabs value={value} handleChange={handleChange} a11yProps={a11yProps} handleClick={handleClick} className="mobileTabs"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListSubheader>
                </>
              }
              <div className="player_area" onDrop={onDrop} onDragOver={onDragOver}>
                {/* Configurator Area */}
                <Player Loader={<LinearProgress />}>
                </Player>
                {isPlayerReady && <div onClick={handleClick} className="add_products_btn">
                  <AddCircleIcon />
                  add products to your build
                </div>}
                {isAboutToDelete && 
                  <div className="delete_icon">
                    <DeleteIcon />
                  </div>
                }
              </div>
              {isPlayerReady && <div className="bottom_player_area">
                <div className="share_div">
                  <ShareModal buyNow={selectionItems} shareGlobalState={shareGlobalState} />
                </div>
                <div className="buy_btn">
                  <BuyNowModal buyNow={selectionItems} />
                </div>
              </div>}
            </div>

            {isPlayerReady && <div className="col-lg-4  mobile_style">
              <div className="configurator_area">
                <div className="card cardMobile">
                  <div className="card-header">
                    <div
                      className={"mobile_close_icon " + closeIconClass}
                      onClick={handleMobileClick}
                    >
                      {/* <CloseIcon /> */}
                      <CancelIcon fontSize="large"/>
                    </div>
                    {!isMobile &&
                      <CustomTabs value={value} handleChange={handleChange} a11yProps={a11yProps} handleClick={handleClick}/>
                    }
                    {/* <Tabs
                      value={value}
                      onChange={handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="scrollable auto tabs example"
                    >
                      <Tab
                        label="Wall Build"
                        {...a11yProps(0)}
                        onClick={handleClick}
                        className="wall_build"
                      />
                      <Tab
                        label="Mobile Build"
                        {...a11yProps(1)}
                        onClick={handleClick}
                        className="mobile_build"
                      />
                    </Tabs> */}
                    <TabPanel
                      value={value}
                      index={0}
                      className={
                        "reduce-padding card-body-content " + fullHeightClass
                      }
                    >
                      <div className="tab-pane" id="wall_build" role="tabpanel">
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

                        <div className="row border-add margin_removed align-center base-wall-mobile">
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
                              {/* <div className="prduct_name">
                                <ItemModal
                                      itemName={wall[0].itemName}
                                      storeSku={wall[0].storeSku}
                                      internetNumber={wall[0].internetNumber}
                                      subitemName={wall[0].subitemName}
                                      subItems={wall[0].subItems}
                                      description={wall[0].description}
                                      learn={wall[0].learn}
                                      buy={wall[0].buy}
                                      addAction={async () => withWallItemAddRejection(addWallRail)}
                                    />
                              </div> */}
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
                                  // itemName={wall[0].itemName}
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

                        <div className="products_area">
                          <div className="row  margin_removed" style={{ position: 'relative' }}>
                            {/* {!wallItems.length && <div className="item-block-overlay">Please select the Rail to get started with your Wall Build.</div>} */}
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
                                  {/* <div className="prduct_name">
                                    <ItemModal
                                      itemName={wall.itemName}
                                      storeSku={wall.storeSku}
                                      internetNumber={wall.internetNumber}
                                      subitemName={wall.subitemName}
                                      subItems={wall.subItems}
                                      description={wall.description}
                                      learn={wall.learn}
                                      buy={wall.buy}
                                      addAction={async () => withWallItemAddRejection(async () => addWallItemById(wall.id))}
                                    />
                                  </div> */}
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
                                  {/* <div className="prduct_name">
                                    <ItemModal
                                      className="addButton"
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
                                    />
                                  </div> */}
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
                                        {/* <div className="prduct_name">
                                          <ItemModal
                                            itemName={item.itemName}
                                            storeSku={item.storeSku}
                                            internetNumber={item.internetNumber}
                                            subitemName={item.subitemName}
                                            subItems={item.subItems}
                                            description={item.description}
                                            learn={item.learn}
                                            buy={item.buy}
                                            addAction={async () => withWallItemAddRejection(async () => addFromMobileToWall(item.id))}
                                          />
                                        </div> */}
                                        <div className="cardButtons">
                                          <div className="addButton"><AddCircleIcon />add</div>
                                          <ItemModal
                                            className="addButton infoButton"
                                            itemName="INFO"
                                            // itemName={item.itemName}
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

                        <div className="reset font-size-small" style={{ opacity: wallItems.length ? 1 : 0.5 }}>
                          <div onClick={() => wallItems.length ? setNotifyModal('resetWall') : null} style={{ cursor: wallItems.length ? 'pointer' : 'default' }}>
                            <h6 className="font-size-small align-items-center d-flex">
                              <RefreshIcon /> Reset Wall build
                            </h6>
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value={value} index={1} className={"reduce-padding card-body-content " + fullHeightClass}>
                      {/* <div className={"mobile_close_icon " + closeIconClass} onClick={handleMobileClick}>
                        <CloseIcon />
                      </div> */}
                      <div className="tab-pane" id="mobile_build" role="tabpanel">
                        <div className="top_product_area dashed_border-bottom mobile_bulder row m-0" style={{ position: 'relative' }}>
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
                                onClick={() => withMobileItemAddRejection(async () => addMobileItemById(rollingBase[0].id))}
                              />
                              {/* <div className="prduct_name">
                                <ItemModal
                                  itemName={rollingBase[0].itemName}
                                  storeSku={rollingBase[0].storeSku}
                                  internetNumber={rollingBase[0].internetNumber}
                                  subitemName={rollingBase[0].subitemName}
                                  subItems={rollingBase[0].subItems}
                                  description={rollingBase[0].description}
                                  learn={rollingBase[0].learn}
                                  buy={rollingBase[0].buy}
                                  addAction={async () => withWallItemAddRejection(async () => addWallItemById(wall.id))}
                                />
                              </div> */}

                              <div className="cardButtons">
                                <div className="addButton" onClick={
                                  () => {
                                    withMobileItemAddRejection(async () => addMobileItemById(rollingBase[0].id))
                                    setId(rollingBase[0].itemName)
                                  }
                                }><AddCircleIcon />add</div>

                                <ItemModal
                                  className="addButton infoButton"
                                  itemName={"INFO"}
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
                                    onClick={() => withMobileItemAddRejection(async () => addMobileItemById(rolling.id))}
                                  />

                                  {/* <div className="prduct_name">
                                    <ItemModal
                                      itemName={rollingBase[0].itemName}
                                      storeSku={rollingBase[0].storeSku}
                                      internetNumber={rollingBase[0].internetNumber}
                                      subitemName={rollingBase[0].subitemName}
                                      subItems={rollingBase[0].subItems}
                                      description={rollingBase[0].description}
                                      learn={rollingBase[0].learn}
                                      buy={rollingBase[0].buy}
                                      addAction={async () => withWallItemAddRejection(async () => addWallItemById(wall.id))}
                                    />
                                  </div> */}

                                  <div className="cardButtons">

                                    <div className="addButton" onClick={
                                      () => {
                                        withMobileItemAddRejection(async () => addMobileItemById(rolling.id))
                                        setId(rolling.itemName)
                                      }
                                    }><AddCircleIcon />add</div>

                                    <ItemModal
                                      className="addButton infoButton"
                                      itemName={"INFO"}
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
                                        {/* <div className="prduct_name">
                                          <ItemModal
                                            itemName={item.itemName}
                                            storeSku={item.storeSku}
                                            internetNumber={item.internetNumber}
                                            subitemName={item.subitemName}
                                            subItems={item.subItems}
                                            description={item.description}
                                            learn={item.learn}
                                            buy={item.buy}
                                            addAction={async () => withMobileItemAddRejection(async () => addFromWallToMobile(item.id))}
                                          />
                                        </div> */}
                                      </div>
                                    </div>
                                  ))}
                            </div>}
                        </div>

                        <div className="reset font-size-small" style={{ opacity: mobileItems.length ? 1 : 0.5 }}>
                          <div onClick={() => mobileItems.length ? setNotifyModal('resetMobile') : null} style={{ cursor: mobileItems.length ? 'pointer' : 'default' }}>
                            <h6 className="font-size-small align-items-center d-flex">
                              <RefreshIcon /> Reset Mobile Storage build
                            </h6>
                          </div>
                        </div>
                      </div>
                    </TabPanel>


                  </div>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
