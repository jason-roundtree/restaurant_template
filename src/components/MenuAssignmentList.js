import React from 'react';

export const MenuAssignmentList = props => {
    let menuItemId = props.menuItemId
    let currentItemActiveMenus = props.activeMenus
    let menuList = props.menus.map((menu, index) => {
        return (
            <li
                key={index}
                id={menu.id}
                onClick={() => {
                    props.menuItemEditStatus ? props.handleMenuAssignment(menu.id, menuItemId) : ''
                }}
                className={
                    currentItemActiveMenus.includes(menu.id) ? 'selectedMenu' : ''
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