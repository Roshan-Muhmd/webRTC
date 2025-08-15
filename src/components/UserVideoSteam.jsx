import React, { useContext } from 'react'
import { broadcastContext } from '../App'

const UserVideoSteam = () => {

    const {localVideoRef} = useContext(broadcastContext)
  return (
    <div>
        <video  ref={localVideoRef} autoPlay playsInline muted style={{ width: "300px", borderRadius: "8px", background: "#000", margin: "5px" }} />
      </div>
  )
}

export default UserVideoSteam