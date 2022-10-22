import React, { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, init: T | (() => T)) {
  const [state, setState] = useState<T>(() => {
    const oldValue = localStorage.getItem(key);
    // localStorage.removeItem(key)
    
    if (oldValue !== null) {
      
      return JSON.parse(oldValue);
    } 

    
    if (typeof init === "function") {
      return (init as () => T)();
    } else {
      return init as T;
    }
  });


  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [state])

  // not working well
  async function save(){
    await localStorage.setItem(key, JSON.stringify(state))
  }


  return {state, setState, save};
}
