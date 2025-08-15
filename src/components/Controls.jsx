import React, { useContext } from "react";
import { broadcastContext } from "../App";

const Controls = () => {
  const {
    isBroadcasting,
    startBroadcast,
    peerId,
    copyPeerId,
    connectId,
    setConnectId,
    connectToBroadcaster,
    hangUp,
    stopBroadcast,
    activeCallsRef
  } = useContext(broadcastContext);
debugger

  return (
    <div
      style={{
        marginTop: "10px",
        display: "flex",
        gap: "5px",
        flexWrap: "wrap",
      }}
    >
    
        <button onClick={isBroadcasting ? stopBroadcast : startBroadcast} disabled={peerId ? false : true}>{isBroadcasting ? "Stop Broadcast" : "Start Broadcast"}</button>
      
      <textarea
        readOnly
        value={peerId}
        placeholder="Your Peer ID"
        style={{ width: "250px", height: "40px", resize: "none" }}
      />
      <button onClick={copyPeerId}>Copy</button>

      <textarea
        value={connectId}
        onChange={(e) => setConnectId(e.target.value)}
        placeholder="Enter Broadcaster's Peer ID"
        style={{ width: "250px", height: "40px", resize: "none" }}
      />
      
      {activeCallsRef.current.length == 0 ?
       <button onClick={() => connectToBroadcaster()}>Connect</button> :
      <button onClick={hangUp}>Hang Up</button>}
    </div>
  );
};
 
export default Controls;
