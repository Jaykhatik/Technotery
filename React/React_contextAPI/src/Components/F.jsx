import React from 'react'
import { useMyContext } from '../context/myContext'

function F() {
    const { count, setCount } = useMyContext();
    return (
        <div className='bg-light p-5'>F-
            <p>
                <button onClick={() => setCount(count + 1)}>count</button>
            </p>
        </div>
    )
}

export default F