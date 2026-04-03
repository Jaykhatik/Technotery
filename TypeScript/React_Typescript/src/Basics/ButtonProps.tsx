import type React from "react"

interface ButtonProps{
    onClick:()=>void
}

const MyButton:React.FC<ButtonProps>=({onClick})=> {
  return (
    <>
    <button onClick={onClick}>click me</button>
    </>
  )
}

export default MyButton