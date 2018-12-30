import React from 'react';

export const MenuAssignmentList = props => {
    const menuItemId = props.menuItemId
    const menuList = props.menus.map(menu => {
        return (
            <li
                key={menu.id}
                id={menu.id}
                onClick={() => {
                    props.menuItemEditStatus 
                        ? props.handleMenuAssignment(menu.id, menuItemId) 
                        : ''
                }}
                className={
                    props.activeMenus.includes(menu.id) 
                        ? 'selectedMenu' 
                        : ''
                }
            >
                {menu.name}
            </li>
        )
    })
    return (
        <ul className="menu-selection">
            {menuList}
        </ul> 
    )
}