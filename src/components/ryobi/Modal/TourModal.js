import React, { useEffect, useState } from 'react';
import { Steps } from "intro.js-react";
import './index.css';
import "intro.js/introjs.css";

export default function FoundIssueModal({ enabled, setEnabled, tabValue }) {
  const onExit = () => {
    setEnabled(false)
  }

  const [step, setStep] = useState(0)
  const [steps, setSteps] = useState([
    {
      element: '.MuiTabs-root',
      intro: 'First, select a base for your build',
      position: 'right',
    },
    {
      element: '.top_product_area',
      intro: 'Please select the base to get started with your mobile build',
    },
    {
      element: '.arButton___2g-fQ',
      intro: 'When your build is ready click here to view it in your space via Augmented Reality',
      position: 'left'
    },
    {
      element: '.player_area',
      intro: 'You can interact with your products in the player'
    },
    {
      element: '.bottom_player_area',
      intro: 'When your build is complete, click on Buy Now to see the list of products and how to purchase them. Click Share to download your build or share it'
    }
  ])

  useEffect(() => {
    setEnabled(false);
    if (step === 0 && tabValue === 0 && enabled === true) {
      setEnabled(false);
        setSteps(
          [
            {
              element: '.MuiTabs-root',
              intro: 'First, select a base for your build',
              position: 'right',
            },
            {
              element: '.base-wall-mobile',
              intro: 'Please select the base to get started with your mobile build',
            },
            {
              element: '.arButton___2g-fQ',
              intro: 'When your build is ready click here to view it in your space via Augmented Reality',
              position: 'left'
            },
            {
              element: '.player_area',
              intro: 'You can interact with your products in the player'
            },
            {
              element: '.bottom_player_area',
              intro: 'When your build is complete, click on Buy Now to see the list of products and how to purchase them. Click Share to download your build or share it'
            }
          ]
        )
        setTimeout(() => {
          setEnabled(true); // for restart intro.js with other steps data
        }, '1 second')
    } else if (step === 0 && tabValue === 1 && enabled === true) {
        setSteps(
          [
            {
              element: '.MuiTabs-root',
              intro: 'First, select a base for your build',
              position: 'right',
            },
            {
              element: '.top_product_area',
              intro: 'Please select the base to get started with your mobile build',
            },
            {
              element: '.arButton___2g-fQ',
              intro: 'When your build is ready click here to view it in your space via Augmented Reality',
              position: 'left'
            },
            {
              element: '.player_area',
              intro: 'You can interact with your products in the player'
            },
            {
              element: '.bottom_player_area',
              intro: 'When your build is complete, click on Buy Now to see the list of products and how to purchase them. Click Share to download your build or share it'
            }
          ]
        )
        setTimeout(() => {
          setEnabled(true); // for restart intro.js with other steps data
        }, '1 second')
    }
  }, [tabValue]
  )

  return (
   <>
     <Steps
      enabled={enabled}
      steps={steps}
      initialStep={0}
      onExit={onExit}
      onChange={(e) => setStep(e)}
      options={{
        skipLabel: 'Skip',
        doneLabel: 'Done',
        tooltipClass: `customTooltip`,
        buttonClass: "introjs-button",
      }}
    />
   </>
  );
}

