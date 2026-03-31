import React from 'react'

function Card({pokeName,img,id}) {
  return (
    <>
      <div className="card">

            <div className="card-header">
                <h1>{pokeName}</h1>
                <p>#00{id}</p>
            </div>

            <div className="card-body">
                <img src={img} alt={pokeName} />
            </div>

            <div className="card-footer">
                <button>GRASS</button>
                <button>POISON</button>
            </div>

        </div>
    </>
  )
}

export default Card