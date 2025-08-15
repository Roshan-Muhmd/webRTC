import ReactModal from "react-modal"



const CommonPopup = (props) => {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "black"
    },
  };

  return (
   <ReactModal isOpen={props?.modalStatus?.open} style={customStyles}>
     
    {props?.modalStatus?.message}
  
   </ReactModal>
  )
}

export default CommonPopup