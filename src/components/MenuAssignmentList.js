import React from 'react';

const MenuAssignmentList = props => {
    console.log('props.activeMenus: ', props.activeMenus)
    const menuItemId = props.menuItemId
    const activeMenusIds = []
    for (let menuId of props.activeMenus) {
        console.log('mmeennuuIIdd: ', menuId)
        activeMenusIds.push(menuId)
    }
    // console.log('activeMenus: ', activeMenus)
    const menuList = props.menus.map(menu => {
        return (
            <button
                className={activeMenusIds.includes(menu.id) 
                    ? 'selected-menu menu-select-button' 
                    : 'menu-select-button '
                }
                key={menu.id}
                id={menu.id}
                onClick={() => props.toggleMenuAssignment(menu.id, menuItemId)}
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

export default MenuAssignmentList