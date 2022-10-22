import React, { useContext, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useFlashMesseges } from "./context/FlashMessegesContext";
import FlashMessage from "./FlashMessage";

export default function FlashMssagesContainer() {
  const { messeges, addErrorMessege } = useFlashMesseges();


  const style= {
    bottom: "0%",
    zIndex: 1000
    // translate: "0% -110%",
  }

  return (
    <>
      <div style={style} className="w-100 position-absolute">
        {messeges.map((msgObj) => {
          return <FlashMessage key={msgObj.id} msgObj={msgObj} />;
        })}
      </div>
    </>
  );
}
