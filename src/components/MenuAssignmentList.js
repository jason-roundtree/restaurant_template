import React from 'react';

export const MenuAssignmentList = props => {
    // console.log('activeMenus props: ', props)
    let menuList = props.menus.map((menu, index) => {
        return (
            <li
                key={index}
                id={menu.id}
                onClick={() => {
                    props.editMode ? props.handleMenuAssignment(menu.id) : ''
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