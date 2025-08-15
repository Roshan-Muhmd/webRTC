# WebRTC Peer-to-Peer Video Communication

A peer-to-peer video streaming application built with **React** and **PeerJS**, using WebRTC for real-time audio/video communication.  
This project supports multi-tab communication via **BroadcastChannel** for testing purposes, and manual ID exchange for cross-device connections.

---

## Features
- Peer-to-peer video streaming using WebRTC
- Automatic peer discovery between browser tabs (local testing)
- Manual peer ID exchange for real-world usage
- Multiple connections handling
- Call termination for individual or all connections
- Status tracking for each peer

---

## Prerequisites
Make sure you have installed:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- A [PeerJS server](https://peerjs.com/) (can use the public server for testing)

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Roshan-Muhmd/webRTC.git
   cd webRTC
   npm install
   npm run dev


## Usage Instructions
1. Local Testing (Same Device, Multiple Tabs)

Open the app in two browser tabs.



Click "Start Broadcast" to begin streaming from your camera.
The broadcast channel will automatically trigger connection in all open tabs 
Cofirmation popup will open
Confirm from respective tabs for instatnt connection



2. Cross-Device Usage

Open the app on Device A and Device B.

On Device A, copy the Peer ID shown.

On Device B, paste the ID into the "Connect" field and click Connect.

Allow camera/microphone permissions.


## Controls

- Start Broadcast – Start sending your video/audio stream
  
- Stop Broadcast – Stop sending your video/audio stream

- Connect – Connect to another peer by their ID

- Hang Up – Terminate the call

- Hang Up All – Disconnect from all active peers


