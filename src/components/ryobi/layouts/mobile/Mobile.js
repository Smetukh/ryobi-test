import React from 'react';

import CustomTabs from '../../tabs/tabs';
import "../../Modal/index.css";

import CancelIcon from '@mui/icons-material/Cancel';
import WallTabPanel from '../../tabs/wallTabPanel';
import RollingBaseTabPanel from '../../tabs/rollingBaseTabPanel';

const Mobile = ({
  wallBuildProps,
  mobileBuildProps,
  closeIconClass,
  handleMobileClick,
  isMobile,
  value,
  handleChange,
  a11yProps,
  handleClick,
  onDragOver,
  onDropAny
}) => {

  return (
    <div className="col-lg-4  mobile_style"  onDrop={onDropAny} onDragOver={onDragOver}>
      <div className="configurator_area">
        <div className="card cardMobile">
          <div className="card-header">
            <div
              className={"mobile_close_icon " + closeIconClass}
              onClick={handleMobileClick}
            >
              <CancelIcon fontSize="large"/>
            </div>
            {!isMobile &&
              <CustomTabs value={value} handleChange={handleChange} a11yProps={a11yProps} handleClick={handleClick}/>
            }
            <WallTabPanel { ...wallBuildProps } index={0} />
            <RollingBaseTabPanel { ...mobileBuildProps } index={1} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mobile;