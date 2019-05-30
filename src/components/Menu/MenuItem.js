import React from 'react'

export default function MenuItem(props) {
    return (
        <div 
            key={props.item._id}
            className={`menu-item ${props.hoverClass}`}
            // openSelectedItemModal prop only gets passed from Order component
            onClick={props.openSelectedItemModal 
                ? () => props.openSelectedItemModal(props.item._id)
                : null
            }
        >
            <p className="left-content">{props.item.name}</p>
            <p className="right-content">{props.item.cost ? `$${props.item.cost.toFixed(2)}` : ''}</p>
            <p className="bottom-content">{props.item.description}</p>
        </div>
    )
}
