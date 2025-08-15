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
    activeCallsRef,
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
      <button
        onClick={isBroadcasting ? stopBroadcast : startBroadcast}
        disabled={peerId ? false : true}
      >
        {peerId
          ? isBroadcasting
            ? "Stop Broadcast"
            : "Start Broadcast"
          : "Initializing..."}
      </button>

      <textarea
        readOnly
        value={isBroadcasting ? peerId : ""}
        placeholder="Start Broadcast to get your Peer ID"
        style={{ width: "300px", height: "40px", resize: "none" }}
      />
      <button onClick={copyPeerId}>Copy</button>

      <textarea
        value={connectId}
        onChange={(e) => setConnectId(e.target.value)}
        placeholder="Enter Broadcaster's Peer ID"
        style={{ width: "250px", height: "40px", resize: "none" }}
      />

      {activeCallsRef.current.length == 0 ? (
        <button
          onClick={() => {
            if (connectId === peerId) {
              alert("Please enter another ID");
              setConnectId("")
              return;
            }
            connectToBroadcaster();
          }}
        >
          Connect
        </button>
      ) : (
        <button onClick={hangUp}>Hang Up</button>
      )}
    </div>
  );
};

export default Controls;
