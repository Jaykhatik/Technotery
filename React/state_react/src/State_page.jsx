import React, { useState } from 'react'
import Img_state from './Img_state';

function State_page() {
    const [name, setName] = useState("Rajesh Nagar");

    const [data, setData] = useState({
        number: 1,
        iImage: true
    });

    return (
        <div>
            <button onClick={() => setName("Akash Patel")}>Change</button>
            <h1>{name}</h1>

            <hr />

            <button onClick={() => setData({ ...data, number: data.number + 1 })}>+</button>
            <h1>{data.number}</h1>
            <button onClick={() => setData({ ...data, number: data.number - 1 })}>-</button>

            <hr />

            <button onClick={()=>setData({...data,iImage:false})}>Hide</button>
            <button onClick={()=>setData({...data,iImage:true})}>Show</button>
            <button onClick={()=>setData({...data,iImage:!data.iImage})}>Toggle</button>

            {data.iImage ? <Img_state /> : null}
        </div>
    )
}

export default State_page

{/* 
    State :-
    ->State is an object that stores dynamic data in a component and controls how the component behaves and renders.    
    ->When state changes → React re-renders the component → UI updates.
    ->Example :
            User clicks button
                    ↓
              State changes
                    ↓
            Component re-renders
                    ↓
                UI updates



    #why state is needed? 
    ->Without state: let count = 0; so here Updating it will not update the UI.
    ->React needs state so it knows when to re-render components.
    ->State is used for:
            form inputs
            counters
            UI toggles
            fetched API data
            loading states
            user interactions
    

    ->IMP: -
        * and for managing this state in recat there is useState hook that is used.
        * it contains two parameter one is variable(count) and second one uus setter function(setCount).
        * Here the count holds the current data of variable and setCount make changes the count variable dynamically.
        * and also the useState always return array that store this two function.
        * synatx : const[count,setCount]=useState(initialvalue);
    */}