import React from 'react';

export const MenuAssignmentList = props => {
    // console.log('activeMenus props: ', props)
    let menuItemId = props.menuItemId
    console.log('menuItemId: ', menuItemId)
    let menuList = props.menus.map((menu, index) => {
        return (
            <li
                key={index}
                id={menu.id}
                onClick={() => {
                    props.menuItemEditStatus ? props.handleMenuAssignment(menu.id, menuItemId) : ''
                }}
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