import React, { useEffect, useState, useContext } from 'react';
import { ConfiguratorContext } from '../../configurator/store/'

export default function Player({ Loader }) {
    const {
        playerStore,
    } = useContext(ConfiguratorContext)

    const {
        isPlayerReady,
        assetLoadingState
    } = playerStore
    
    return (
        <div style={{ height: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}> {(assetLoadingState !== 1 || !isPlayerReady) && Loader} </div>
            <div id="tk-player" style={{ height: '100%', width: '100%', position: 'absolute' }}></div>
        </div>
    );
}