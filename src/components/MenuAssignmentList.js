import React from 'react';

export const MenuAssignmentList = props => {
    const menuItemId = props.menuItemId
    const menuList = props.menus.map(menu => {
        return (
            <button
                className={props.activeMenus.includes(menu.id) 
                    ? 'selected-menu menu-button' 
                    : 'menu-button'
                }
                data-disabled={props.buttonDisabled}
                key={menu.id}
                id={menu.id}
                onClick={() => {
                    props.menuItemEditStatus 
                        ? props.handleMenuAssignment(menu.id, menuItemId) 
                        : ''
                    }
                }
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