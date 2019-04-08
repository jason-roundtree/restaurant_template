import React from 'react';
import { MenuAssignmentList } from './MenuAssignmentList'; 

export default function MenuItem(props) {
    let menuItems = props.menuItems.map(item => {
        let activeMenus = item.menus
        return (
            <div key={item.id}>
                <li 
                    key={item.id}
                    id={item.id}
                    className="menu-item"
                >
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <p>{item.cost ? `$ ${item.cost}` : ''}</p>

                    <MenuAssignmentList 
                        menus={props.menus}
                        activeMenus={activeMenus}
                        handleMenuAssignment={props.handleMenuAssignment}
                        menuItemId={item.id}
                        menuItemEditStatus={item.editable}
                    />
                    
                    <button onClick={() => props.onClick(item.id)}>
                        {item.editable ? 'Save' : 'Edit'}
                    </button>

                </li>
            </div>
        )
    })
    return menuItems
}