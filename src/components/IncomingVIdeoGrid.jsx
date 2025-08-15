import React, { useContext } from "react";
import { broadcastContext } from "../App";

const IncomingVideoGrid = () => {
  const { remoteStreams, peerStatuses } = useContext(broadcastContext);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "20px",
      }}
    >
      {remoteStreams?.map(({ peerId, stream }) => (
        <div key={peerId} style={{ textAlign: "center" }}>
          <video
            autoPlay
            playsInline
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
            style={{
              width: "300px",
              borderRadius: "8px",
              background: "#000",
              margin: "5px",
            }}
          />
          <div>Status: {peerStatuses[peerId] || "Connecting..."}</div>
        </div>
      ))}
    </div>
  );
};

export default IncomingVideoGrid;
