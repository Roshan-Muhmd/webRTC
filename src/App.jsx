import React, { useState, useRef, useEffect, createContext } from "react";
import UserVideoSteam from "./components/UserVideoSteam";
import Controls from "./components/Controls";
import IncomingVideoGrid from "./components/IncomingVIdeoGrid";
import useInitializeRTC from "./hooks/useInitializeRTC";
import CommonPopup from "./ui/CommonPopup";

export const broadcastContext = createContext({
  channelRef: null,
  peerInstance: null,
  localStreamRef: null,
  localVideoRef: null,
  remoteStreams: null,
  isBroadcasting: null,
  setIsBroadcasting: null,
  peerId: null,
  peerStatuses: null,
  startBroadcast: null,
  copyPeerId: null,
  connectId: null,
  setConnectId: null,
  hangUp: null,
  connectToBroadcaster: null
});

export default function App() {


  //initilaize RTC (peer js instance)
  const broadcastData =  useInitializeRTC()
 
  
  
  
 

 
 


  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>React-WebRTC</h1>
      <broadcastContext.Provider
        value={broadcastData}
      >
      {/* Local Video */}
      <UserVideoSteam />

      {/* Controls */}
      <Controls/>

      {/* Remote Videos */}
       <IncomingVideoGrid/>
       

       {/* Common modal for connection notification */}
       <CommonPopup modalStatus={broadcastData?.modalStatus}/>
      </broadcastContext.Provider>
    </div>
  );
}

