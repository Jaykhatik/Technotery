import React from 'react'
import A from './Components/A'
import B from './Components/B'
import { useMyContext } from './context/myContext'

function App() {
  const { count } = useMyContext();
  return (
    <div className='container bg-danger p-5 w-25 m-auto '>
      App-<h2>{count}</h2>
      <A />
      <B />
    </div>
  )
}

export default App