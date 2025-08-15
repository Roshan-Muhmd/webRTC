import React, { useRef, useState, useEffect } from "react";
import Peer from "peerjs";

const useInitializeRTC = () => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [peerId, setPeerId] = useState("");
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [peerStatuses, setPeerStatuses] = useState({});
  const [connectId, setConnectId] = useState("");
  const [modalStatus, setModalStatus] = useState({ open: false, message: "" });
  const [modalCallBack, setModalCallBack] = useState({
    ok: () => {},
    cancel: () => {},
  });

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerInstance = useRef(null);
  const channelRef = useRef(null);
  const userNameRef = useRef(null)
  const activeCallsRef = useRef([]);


  const initializePeer = () => {
    const peer = new Peer();
    peerInstance.current = peer;

    // Set peer ID once connected to PeerJS server
    peer.on("open", (id) => {
      setPeerId(id);
    });

    // Handle incoming WebRTC calls
    peer.on("call", (call) => {

    //Answering call and returning video/audio stream
      call.answer(localStreamRef.current);
      activeCallsRef.current.push(call);

      updateStatus(call.peer, "Connecting");

      // When remote stream is received, add it in the list
      call.on("stream", (remoteStream) => {
        setRemoteStreams((prev) => [
          ...prev.filter((s) => s.peerId !== call.peer),
          { peerId: call.peer, stream: remoteStream },
        ]);
        updateStatus(call.peer, "Connected");
      });

      // Handle call end
      call.on("close", () => {
        updateStatus(call.peer, "Disconnected");
      });
    });
  }
 
  
  useEffect(() => {
    
    // Initialize PeerJS connection
    initializePeer()

    // Setup BroadcastChannel for same-device tab communication
    const channel = new BroadcastChannel("webrtc-signaling");
    channelRef.current = channel;

    // Listen for broadcasted peer IDs from other tabs
    channel.onmessage = (event) => {
      if (!isBroadcasting && event.data.type === "BROADCAST_ID") {
        const modalBody = (
          <>
            <h2>Confirmation</h2>
            <p style={{ textAlign: "center" }}>
              Broadcast started by User: {event.data?.username ??  event.data?.peerId}
            </p>
            <p style={{ textAlign: "center" }}>Accept connection ?</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => {
                    
                  setConnectId(event.data.peerId);
                  connectToBroadcaster(event.data.peerId, true);
                  setModalStatus({ open: false, message: "" });
                  setRemoteStreams((prev) => [
                    ...prev.filter((s) => s.peerId !== event.data.peerId),
                    { peerId: event.data.peerId, stream: event.data.stream },
                  ]);

                }}
                id="okBtn"
              >
                OK
              </button>
              <button
                onClick={() => {
                  setModalStatus({ open: false, message: "" });
                }}
                id="cancelBtn"
              >
                Cancel
              </button>
            </div>
          </>
        );

        // Show confirmation modal
        setModalStatus({ open: true, message: modalBody });
      }
    };

    // Cleanup on component unmount
    return () => {
      peerInstance.current?.destroy();
      channel.close();
      
    };
  }, []);

  // Start broadcasting local video/audio stream
  const startBroadcast = async () => {
    try {

    //get video and audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      localVideoRef.current.srcObject = stream;
      setIsBroadcasting(true);

      setModalStatus({
        open: true,
        message: (
          <>
            <p>Enter username (* optional)</p>
            <input style={{margin:"10px", height:"40px"}} ref={userNameRef}></input>
            <button
              onClick={() => {
                
                // Share peer ID with other tabs on the same device
                channelRef.current.postMessage({
                  type: "BROADCAST_ID",
                  peerId,
                username: userNameRef?.current?.value || peerId,
                });
                setModalStatus({open:false,message:""})
              }}
            >
              Proceed
            </button>
          </>
        ),
      });
    } catch (err) {
      console.error("Error accessing camera/mic:", err);
    }
  };

  // Update connection status for a peer
  const updateStatus = (id, status) => {
    setPeerStatuses((prev) => ({ ...prev, [id]: status }));
  };

  // Copy own Peer ID to clipboard
  const copyPeerId = () => {
    navigator.clipboard.writeText(peerId);
    alert("Peer ID copied to clipboard!");
  };

  // Connect to another broadcaster by ID
  const connectToBroadcaster = async (id = connectId, auto = false) => {
    
    if (!id ) return;
    
    updateStatus(id, "Connecting");

    let streamToSend = localStreamRef.current;

    // If no local stream, request camera/mic access
    if (!streamToSend) {
      try {
        streamToSend = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = streamToSend;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = streamToSend;
        }
      } catch (err) {
        console.error("Could not access camera/mic:", err);
        updateStatus(id, "Failed to get media");
        return;
      }
    }

    //initiate call with broadcaster
    const call = peerInstance.current.call(id, streamToSend);

    // Handle remote stream
    call.on("stream", (remoteStream) => {
        
      setRemoteStreams((prev) => [
        ...prev.filter((s) => s.peerId !== call.peer),
        { peerId: call.peer, stream: remoteStream },
      ]);
      activeCallsRef.current.push(call);
      updateStatus(call.peer, "Connected");
    });

    // Handle call end
    call.on("close", () => {
      updateStatus(call.peer, "Disconnected");
      setConnectId("")
    });

    //call error
    call.on("error", (err) => {
       alert("connection failed")
        updateStatus(id, "Failed to connect");
        setConnectId("");
      });

     /* setConnectId(""); */
  };

  // End all connections and reset state
  const hangUp = () => {
    
    peerInstance.current?.destroy();
    setRemoteStreams([]);
    setPeerStatuses({});
    setIsBroadcasting(false);
    setPeerId("");
    setConnectId("");
    activeCallsRef.current = [];
    
    //Start new peer instance after hangup
    initializePeer()
  };

  //Stop Broadcast and end all calls
  const stopBroadcast = () => {
   
    activeCallsRef.current.forEach((call) => {
        try {
          call.close();
        } catch (e) {
          console.error("Error closing call", e);
        }
      });
    
      hangUp()
  }

  return {
    channelRef,
    peerInstance,
    localStreamRef,
    localVideoRef,
    remoteStreams,
    isBroadcasting,
    setIsBroadcasting,
    peerId,
    remoteStreams,
    peerStatuses,
    startBroadcast,
    copyPeerId,
    connectId,
    setConnectId,
    hangUp,
    connectToBroadcaster,
    modalStatus,
    setModalStatus,
    modalCallBack,
    stopBroadcast,
    activeCallsRef
  };
};

export default useInitializeRTC;
