import React from 'react';
import '../index.css';

export default class AddMenuItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            componentActive: false,
            activeMenus: [] 
        }
    }
    toggleMenuAssignment = menuId => {
        console.log('toggleMenuAssignment')
        if (!this.state.activeMenus.includes(menuId)) {
            this.setState({
                activeMenus: [...this.state.activeMenus, menuId]
            })
        } else {
            const updatedMenus = this.state.activeMenus.filter(menu => menu !== menuId)
            this.setState({
                activeMenus: updatedMenus
            })
        }
    }
    handleCreateNewMenuItemClick = () => {
        console.log('handleCreateNewMenuItemClick')
        this.setState({
            componentActive: true
        })
    }
    // TODO: add validation for input fields
    saveMenuItem = e => {
        console.log('saveMenuItem')
        e.preventDefault()
        this.setState({
            componentActive: false
        })
    }
    componentDidUpdate() {
        console.log('add menu item ', this.state)
    }
    render() {
        const menuList = this.props.menus.map(menu => {
            return (
                <li
                    key={menu.id}
                    id={menu.id}
                    onClick={() => this.toggleMenuAssignment(menu.id)}
                    className={
                        this.state.activeMenus.includes(menu.id) 
                            ? 'selectedMenu' 
                            : ''
                    }
                >
                    {menu.name}
                </li>
            )
        })
        return (
            <div>
                <button onClick={this.handleCreateNewMenuItemClick}>
                    Create New Menu Item
                </button>

                <form className={!this.state.componentActive ? 'hidden' : ''}>
                    <label htmlFor="menu-name">Item Name</label>
                    <input 
                        type="text" 
                        id="menu-name"
                    />
                    <br />

                    <label htmlFor="menu-description">Description</label>
                    <input 
                        type="text" 
                        id="menu-description"
                    />
                    <br />

                    <label htmlFor="menu-cost">Cost</label>
                    <input 
                        type="text" 
                        id="menu-cost"
                    />
                    <br />

                    <label htmlFor="menu-selection">Select Menus</label>
                    <ul className="menu-selection" id="menu-selection">
                        {menuList}
                    </ul>
                    
                    <button onClick={this.saveMenuItem}>
                        Add Item
                    </button>
                </form>
            </div>
        )
    }
}