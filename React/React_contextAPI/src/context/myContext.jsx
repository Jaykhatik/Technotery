import { Children, createContext, useContext, useState } from "react";

const myContext = createContext();
const useMyContext = () => {
    return useContext(myContext);
}

const MyContextProvider = ({ children }) => {

    const [count,setCount]=useState(0);

    const value={
        count,//here the key and value has same name thats why we write only one time
        setCount,
    }
    return (
        <myContext.Provider value={value}>
            {children}
        </myContext.Provider>
    )
}
console.log(MyContextProvider)

export { MyContextProvider, useMyContext };