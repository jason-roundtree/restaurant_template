import React from 'react';
import { MenuAssignmentList } from './MenuAssignmentList' 
import { EditMenuButton } from './EditMenuButton' 

// TODO: change this back to functional component
export default class MenuItem extends React.Component {
    render () {
        let menuItems = this.props.menuItems.map((item, index) => {
            let activeMenus = item.menus
            return (
                <div>
                    <li 
                        key={index}
                        id={item.id}
                        className="menu-item"
                    >
                        <p>{item.name}</p>
                        <p>{item.description}</p>
                        <p>&#36;{item.cost}</p>

                        <MenuAssignmentList 
                            menus={this.props.menus}
                            activeMenus={activeMenus}
                            handleMenuAssignment={this.props.handleMenuAssignment}
                            menuItemId={item.id}
                            menuItemEditStatus={item.editable}
                        />
                        <button onClick={() => this.props.onClick(item.id)}>
                            {item.editable ? 'Save' : 'Edit'}
                        </button>

                    </li>
                </div>
            )
        })
        return menuItems
    }
}