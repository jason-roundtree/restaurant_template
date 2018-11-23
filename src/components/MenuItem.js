import React from 'react';
import { MenuAssignmentList } from './MenuAssignmentList' 
import { EditMenuButton } from './EditMenuButton' 

export default class MenuItem extends React.Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         currentItem: '',
    //         editMode: false
    //     }
    // }
    // toggleEditMode = id => {
    //     this.setState({
    //         // currentItem: id,
    //         // editMode: !this.state.editMode
    //     })
    // }
    // componentDidUpdate() {
    //     console.log('MenuItem state: ', this.state)
    // }
    render () {
        // TODO: return this whole thing instead of assigning to variable??
        let menuItems = this.props.menuItems.map((item, index) => {
            let activeMenus = item.menus
            // if (item.menus.length > 0) {
            //     item.menus.forEach(menu => {
            //         activeMenus.push(menu)
            //     })
            // }
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
                        {/* TODO: make separate button component?? */}
                        {/* <EditMenuButton menuItem={item.id} /> */}
                        <button onClick={() => {
                            this.props.onClick(item.id)
                            
                        }}>
                            {item.editable ? 'Save' : 'Edit'}
                        </button>

                    </li>
                </div>
            )
        })
        return menuItems
    }
}