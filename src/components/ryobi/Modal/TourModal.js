import React, { useEffect, useState } from 'react';
import { Steps } from "intro.js-react";
import './index.css';
import "intro.js/introjs.css";
import introJs from 'intro.js';

export default function FoundIssueModal({ enabled, setEnabled }) {
  const onExit = () => {
    setEnabled(false)
  }

  const steps = [
    // {
    //   title: 'Welcome',
    //   intro: <div>
    //     <div>Get started with your RYOBI LINK Custom Storage Solution</div>
    //     <div className="dontShowBlock">
    //       <span>
    //         Don`t show again
    //       </span>
    //       <label>
    //         <input type="checkbox" onChange={(e) => {console.log('qqq console !!!!')}} />
    //       </label>
    //     </div>
    //   </div>,
    //   position: 'center'
    // },
    {
      element: '.MuiTabs-root',
      intro: 'First, select a base for your build',
      position: 'right',
    },
    {
      element: '.top_products_intro',
      intro: 'Please select the base to get started with your mobile build',
    },
    {
      element: '.products_block',
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
  ];

  return (
   <>
     <Steps
      enabled={enabled}
      steps={steps}
      initialStep={0}
      onExit={onExit}
      options={{
        skipLabel: 'Skip',
        doneLabel: 'done',
        tooltipClass: `customTooltip`,
        buttonClass: "introjs-button",
      }}
    />
   </>
  );
}

