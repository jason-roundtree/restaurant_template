import React from 'react';

const MenuAssignmentList = props => {
    const activeMenusIds = []
    for (let menuId of props.activeMenus) {
        activeMenusIds.push(menuId)
    }
    const menuList = props.menus.map(menu => {
        return (
            <button
                className={activeMenusIds.includes(menu.id) 
                    ? 'selected-menu menu-assignment-button' 
                    : 'menu-assignment-button '
                }
                key={menu.id}
                id={menu.id}
                onClick={() => props.toggleMenuAssignment(menu.id)}
            >
                {menu.name}
            </button>
        )
    })
    return (
        <div className="menu-selection">
            {menuList}
        </div> 
    )
}

export default MenuAssignmentList;