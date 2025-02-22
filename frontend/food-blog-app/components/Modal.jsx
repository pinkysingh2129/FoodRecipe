import React from 'react'

export default function Model({children,onClose}){
    return (
        <>
        <div className ='backdrop' onClick={onClose}>
            <dialog className ='modal' open onClick={(e) => e.stopPropagation()}>
                {children}
                <button onClick={onClose} className="close-btn">Close</button>
            </dialog>
        </div>
        </>

    )
}