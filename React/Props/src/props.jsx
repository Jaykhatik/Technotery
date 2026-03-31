import React from 'react'

function Props({heading,img,title,desc,f_title}) {
  return (
    <>
    <div className="card">
        <div className="card-header">
            <h1>{heading}</h1>
        </div>
        <div className="card-body">
            <img src={img} alt="fff" />
            <p>{title}</p>
            <span>{desc}</span>
        </div>
        <div className="card-footer">
            <h3>{f_title}</h3>
        </div>
    </div>
    </>
  )
}

export default Props