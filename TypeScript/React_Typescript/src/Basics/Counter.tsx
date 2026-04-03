import { useState } from "react"


function Counter() {
    const [count, setCount] = useState<number>(0);//here we write "<number>" beacuse we strictly say that the useState must conatins only numbers if we put strings in it then it gives error.
    return (
        <>
            <div className="counter">
                <h1>{count}</h1>
                <button onClick={() => setCount((c) => c + 1)}>Add One More</button>
                <button onClick={() => setCount((c) => c - 1)}>Remove One</button>
            </div>
        </>
    )
}

export default Counter