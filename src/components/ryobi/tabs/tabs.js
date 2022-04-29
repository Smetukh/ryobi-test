import { Tabs, Tab } from '@mui/material';
import React from 'react';
import './tabs.css';

const CustomTabs = ({ value, handleChange, handleClick, a11yProps, className }) => {
    return (
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        className={className}
      >
        <Tab
          label="Wall Build"
          {...a11yProps(0)}
          onClick={!!handleClick ? handleClick : () => {}}
          className="wall_build button_build"
        />
        <Tab
          label="Mobile Build"
          {...a11yProps(1)}
          onClick={!!handleClick ? handleClick : () => {}}
          className="mobile_build button_build"
        />
    </Tabs>
    )
}

export default CustomTabs;