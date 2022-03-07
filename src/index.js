/* eslint-disable import/first */
// import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/utils';
// ClassNameGenerator.configure((componentName) => `tk-app-mui-${componentName}`);

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppStyles } from "./App.styles.js";
import "./fonts.css";
import ConfiguratorProvider from './configurator/store'

ReactDOM.render(
  <React.StrictMode>
    <ConfiguratorProvider>
      <AppStyles id="tk--link-builder-root-styles">
        <App />
      </AppStyles>
    </ConfiguratorProvider>
  </React.StrictMode>,
  document.getElementById("tk--link-builder-root")
);
