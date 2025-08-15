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
  } = useContext(broadcastContext);


  return (
    <div
      style={{
        marginTop: "10px",
        display: "flex",
        gap: "5px",
        flexWrap: "wrap",
      }}
    >
      {!isBroadcasting && (
        <button onClick={startBroadcast} disabled={peerId ? false : true}>Start Broadcast</button>
      )}
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
      <button onClick={() => connectToBroadcaster()}>Connect</button>

      <button onClick={hangUp}>Hang Up</button>
    </div>
  );
};

export default Controls;
