import React, { useState } from 'react'

export default function Task({id, task, state, deleteHandler, completeHandler}) {
    const [isHover, setIsHover] = useState(false);

  return (
    <div className="d-flex align-items-center position-relative"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
    >
        <li className={`fw-light fs-4 py-2 px-4 d-flex w-100 border-bottom ${isHover ? "colorGray" : "colorLightGray"} ${state ? "text-decoration-line-through" : ""}`}
            onClick={() => completeHandler(id)}
        >
            {task}
        </li>

        <button 
            onClick={() => deleteHandler(id)} 
            className={`btn colorLightGray fs-6 position-absolute top-10 end-0 ${isHover ? "d-block" : "d-none"}`}
        >
            x
        </button>
    </div>
  )
}

