import react, { useContext, useState } from "react";
import { flashMessegeType, messegesTypes } from "../../types/types";
import { v4 as uuidv4 } from 'uuid';

type messegesContextValueProps = {
  messeges: flashMessegeType[];
  addMessege: (msg: string, type:messegesTypes, delay?: number) => void,
  addErrorMessege: (msg: string,  delay?: number) => void,
  addSuccessMessege: (msg: string,  delay?: number) => void,
};

let context = react.createContext({} as messegesContextValueProps);

export function useFlashMesseges() {
  return useContext(context);
}

export function FlashMessegesProvider({ children }: { children: any }) {
  const [messeges, setMesseges] = useState<flashMessegeType[]>(
    [] as flashMessegeType[]
  );

  function addMessege(msg: string, type: messegesTypes, delay: number = 4000) {
    if(!msg) return;
    
    let newMessegeObj: flashMessegeType = {
        id: uuidv4(),
        messege: msg,
        type
    }

    setMesseges((prevState) => {
        let newState: flashMessegeType[] = [...prevState]
        newState.push(newMessegeObj)

        setTimeout(() => {
            setMesseges((oldMesseges) => oldMesseges.filter(msgObj => msgObj.id !== newMessegeObj.id))
        }, delay)

        return newState
    })

  }

  function addErrorMessege(msg: string,  delay?: number){
    addMessege(msg, messegesTypes.ERROR, delay)
  }

  function addSuccessMessege(msg: string,  delay?: number){
    addMessege(msg, messegesTypes.SUCCESS, delay)
  }

  return (
    <context.Provider value={{ messeges, addMessege, addErrorMessege, addSuccessMessege }}>
      {children}
    </context.Provider>
  );
}
