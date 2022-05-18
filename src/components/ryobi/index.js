import React, { useState, useEffect, useContext } from "react";
import BuyNowModal from "./Modal/BuyNowModal";
import ShareModal from "./Modal/ShareModal";
import FoundIssueModal from "./Modal/FoundIssueModal";
import TourModal from './Modal/TourModal';
import ResetModal from "./Modal/ResetModal";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "./header";
import Snackbar from '@mui/material/Snackbar';
import { useMediaQuery } from 'react-responsive'
import ListSubheader from '@mui/material/ListSubheader';
import Mobile from './layouts/mobile/Mobile';
import "intro.js/introjs.css";
import "./Modal/index.css";

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
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
import Notification from "./notification/notification";

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

  const [notifyModal, setNotifyModal] = useState('')
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

  const [enabled, setEnabled] = useState(false); 
  useEffect(() => {
    if (!!localStorage.getItem('showTour') && localStorage.getItem('showTour') === 'true' && isPlayerReady) {
      setNotifyModal('welcome');
    } else if (!localStorage.getItem('showTour') && isPlayerReady) {
      localStorage.setItem('showTour', true);
      setNotifyModal('welcome');
    }
  },
  [isPlayerReady]
  )

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
    if (value === 0) {
      !!wallId ? withWallItemAddRejection(async () => addWallItemById(wallId)) : withWallItemAddRejection(async () => addWallRail());
    } else if (value === 1) {
      !!wallId ? withMobileItemAddRejection(async () => addMobileItemById(wallId)) : withMobileItemAddRejection(async () => addMobileItemById(rollingBase[0].id));
    }
  }

  const wallBuildProps = { TabPanel, value, fullHeightClass, wallSizes, withWallSizeChangeRejection, setWallWidth, setWallHeight, wallWidth,
    wallHeight, wall, withWallItemAddRejection, addWallRail, handleMobileClick, onDragStart, setId, isMobile, wallBuild, addWallItemById, mobileInWallItems,
    displayItems, addFromMobileToWall, setEnabled, wallItems, setNotifyModal
  }

  const mobileBuildProps = { TabPanel, value, fullHeightClass, handleMobileClick, onDragStart, setId, isMobile, setEnabled, setNotifyModal,
    withMobileItemAddRejection, rollingBase, addMobileItemById, mobileItems, rollingBaseItem, wallInMobileItems, displayItems, addFromWallToMobile
  }

  const mobileProps = {
    wallBuildProps,
    mobileBuildProps,
    closeIconClass,
    handleMobileClick,
    isMobile,
    value,
    handleChange,
    a11yProps,
    handleClick
  }


  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} move={move}>
      <TourModal enabled={enabled} setEnabled={setEnabled} tabValue={value}/>
      <FoundIssueModal setEnabled={setEnabled} open={notifyModal === 'welcome'} fullHeightClick={handleClick} setOpen={setNotifyModal} messagePayload={messages.welcome} isMobile={isMobile} isPlayerReady={isPlayerReady} isWelcome={true}/>
      <FoundIssueModal open={notifyModal === 'noSpaceWall'} setOpen={setNotifyModal} messagePayload={messages.noSpaceWall} />
      <FoundIssueModal open={notifyModal === 'noSpaceMobile'} setOpen={setNotifyModal} messagePayload={messages.noSpaceMobile} />
      <FoundIssueModal open={notifyModal === 'destructiveWallSize'} setOpen={setNotifyModal} messagePayload={messages.destructiveWallSize} />
      <ResetModal open={notifyModal === 'resetWall'} setOpen={setNotifyModal} messagePayload={messages.resetWall} onConfirm={resetWallState} />
      <ResetModal open={notifyModal === 'resetMobile'} setOpen={setNotifyModal} messagePayload={messages.resetMobile} onConfirm={resetMobileState} />

      <div className={`main_wrapper`} style={{ pointerEvents: move > 150 ? 'none' : 'all' }}>
        <div className="container custom-container">
          <div className="row">
            <div className={isPlayerReady ? "col-lg-8": "col-lg-12"}>
              {isMobile && <span onClick={() => scrollUpClick()} style={{ position: 'fixed', right: '0', top: '60px', zIndex: '10', visibility: scrollY < 115 ? 'hidden' : 'visible', backgroundColor: '#f3f3f3', borderRadius: '50%' }}><ArrowUpwardIcon style={{color: 'grey'}} fontSize='large'/></span>}
              {isMobile && <span onClick={scrollDownClick} style={{ position: 'fixed', right: '0', bottom: '10%', zIndex: '10', backgroundColor: '#f3f3f3', borderRadius: '50%' }}><ArrowDownwardRoundedIcon style={{color: 'grey'}} fontSize='large'/></span>}
              {!isMobile && <Header />}
              {isMobile &&
                <>
                  <Notification open={open} handleCloseBar={handleCloseBar} id={id}/>
                  <Header />
                  <ListSubheader>
                    <div className="col-lg-4  mobile_style">
                      <div className="configurator_area">
                        <div className="card">
                          <div className="card-header">
                            <CustomTabs value={value} handleChange={handleChange} a11yProps={a11yProps} className="mobileTabs"/>
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
            {isPlayerReady && <Mobile { ...mobileProps }/>}
          </div>
        </div>
      </div>
    </div>
  );
}
