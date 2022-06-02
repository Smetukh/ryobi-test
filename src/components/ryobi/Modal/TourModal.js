import React, { useEffect } from 'react';
import './index.css';
import "intro.js/introjs.css";

export default function FoundIssueModal({ enabled, setEnabled, tabValue, isMobile, intro }) {
  intro.onexit(() => setEnabled(false)); // the function is called when the tour closes
  const steps = [
    {
      element: '.MuiTabs-root',
      intro: 'First, select the type of Custom Storage Build'
    },
    {
      element: '.top_product_area',
      intro: 'Next, select the base to get started with your build',
      position: 'left'
    },
    {
      element: `.products_block`,
      intro: 'Now, add an additional product to your build'
    },
    {
      element: '.player_area',
      intro: 'You can interact with your products in the builder.'
    },
    {
      element: `[class^='arButton']`,
      intro: 'When your build is ready click here to view it in your space via Augmented Reality'
    },
    {
      element: '.bottom_player_area',
      intro: 'When your build is complete, click on Buy Now to see the list of products and how to purchase them. Click Share to download your build or share it'
    }
  ] // initial steps for MOBILE BUILD

  intro.setOptions({
    steps: steps,
    nextLabel: 'Next',
    skipLabel: 'Skip',
    doneLabel: 'Done',
    tooltipClass: `customTooltip`,
    buttonClass: "introjs-button",
    exitOnOverlayClick: false
  })

  useEffect(() => {
    // when the tabs change and tour is active, new options for steps are saved
    if (tabValue === 0 && enabled) {
      intro.setOptions({
        steps: [
          {
            element: isMobile ? '.mobileTabs' : '.MuiTabs-root',
            intro: 'First, select the type of Custom Storage Build'
          },
          {
            element: '.base-wall-mobile',
            intro: 'Next, select the base to get started with your build',
            position: 'left'
          },
          {
            element: `.products_area`,
            intro: 'Now, add an additional product to your build'
          },
          {
            element: '.player_area',
            intro: 'You can interact with your products in the builder.'
          },
          {
            element: `[class^='arButton']`,
            intro: 'When your build is ready click here to view it in your space via Augmented Reality'
          },
          {
            element: '.bottom_player_area',
            intro: 'When your build is complete, click on Buy Now to see the list of products and how to purchase them. Click Share to download your build or share it'
          }
        ],
        nextLabel: 'Next',
        skipLabel: 'Skip',
        doneLabel: 'Done',
        tooltipClass: `customTooltip`,
        buttonClass: "introjs-button",
        exitOnOverlayClick: false
      }).start();
      } else if (tabValue === 1 && enabled) {
        intro.setOptions({
          steps: [
            {
              element: '.MuiTabs-root',
              intro: 'First, select the type of Custom Storage Build '
            },
            {
              element: '.top_product_area',
              intro: 'Next, select the base to get started with your build',
              position: 'left'
            },
            {
              element: `.products_block`,
              intro: 'Now, add an additional product to your build',
            },
            {
              element: '.player_area',
              intro: 'You can interact with your products in the builder.'
            },
            {
              element: `[class^='arButton']`,
              intro: 'When your build is ready click here to view it in your space via Augmented Reality'
            },
            {
              element: '.bottom_player_area',
              intro: 'When your build is complete, click on Buy Now to see the list of products and how to purchase them. Click Share to download your build or share it'
            }
          ],
          nextLabel: 'Next',
          skipLabel: 'Skip',
          doneLabel: 'Done',
          tooltipClass: `customTooltip`,
          buttonClass: "introjs-button",
          exitOnOverlayClick: false
        }).start();
      }
  }, [tabValue, enabled]
  )

  return (
   <></>
  );
}

