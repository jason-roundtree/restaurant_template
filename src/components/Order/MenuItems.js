import React from 'react'

// TODO: update component name to prevent confusion with admin component?
export default function MenuItems(props) {
  return (
    <div 
        // className="menu-item"
      onClick={() => props.openSelectedItemModal(props.id)}
    >
        <p>{props.name}</p>
        <p>{props.cost ? `$${props.cost.toFixed(2)}` : ''}</p>
    </div>
  )
}

