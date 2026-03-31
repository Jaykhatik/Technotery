import { useDispatch, useSelector } from "react-redux"
import { addToProduct } from "./redux/action/productAction";


function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return state;
  })
  console.log(state)
  return (
    <>
      <h1>My Redux App</h1>
      <button onClick={() => dispatch(addToProduct({name:"jay"}))}>click</button>

    </>
  )
}

export default App