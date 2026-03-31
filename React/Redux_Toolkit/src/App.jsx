import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { decrement, increment, incrementByAmount } from './redux/features/counterSlice';

const App = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value)
  const [num, setNum] = useState(0);
  return (
    <div>
      <h2 className='text-5xl'>Redux-Toolkit</h2>
      <h1>{count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <input type="number"
        value={num}
        onChange={(e) => {
          setNum(e.target.value)
        }} />
      <button onClick={() => dispatch(incrementByAmount(Number(num)))}>Increment by amount</button>
    </div>
  )
}

export default App