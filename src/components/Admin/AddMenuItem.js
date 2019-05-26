import React from 'react';
import { Button, Alert } from 'reactstrap';
import axios from 'axios';
const { API_BASE_URL } = require('../../config');

// TODO: Review and sort out unused code
export default class AddMenuItem extends React.Component {
    state = {
        componentActive: false,
        showInputErrorMsg: false,
        showSuccessMsg: false,
        activeMenus: [],
        nameInput: '',
        descriptionInput: '',
        costInput: ''
    }
    toggleMenuAssignment = (e, menuId) => {
        e.preventDefault()
        console.log('menuId: ', menuId)
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
    createNewMenuItemClick = () => {
        this.setState({
            componentActive: true
        })
    }
    saveMenuItem = e => {
        e.preventDefault()
        if (this.state.nameInput === '' || this.state.activeMenus.length < 1) {
            this.setState({
                showInputErrorMsg: true
            })
        } else {
            const menuItem = {
                name: this.state.nameInput,
                description: this.state.descriptionInput,
                cost: this.state.costInput,
                menus: this.state.activeMenus
            }

            axios.post(`${API_BASE_URL}/menu_items`, menuItem)
                // TODO: should I do something with the response??
                .then(res => {
                    console.log('menu item posted response: ', res)
                })
                .catch(err => console.log(err))

            this.setState({
                componentActive: false,
                showInputErrorMsg: false,
                showSuccessMsg: true,
                activeMenus: [],
                nameInput: '',
                descriptionInput: '',
                costInput: '',
                // TODO: best react or react-router way to reload parent component?? Do I have to lift state up to AdminDashboard??
            }, () => window.location.reload())
        }
    }
    handleInputChange = e => {
        const { id, value } = e.target
        this.setState({
            [id]: value
        })
    }
    
    render() {
        const menuList = this.props.menus.map(menu => {
            return (
                <button
                    key={menu.id}
                    id={menu.id}
                    onClick={e => this.toggleMenuAssignment(e, menu.id)}
                    className={this.state.activeMenus.includes(menu.id) ? 'selected-menu menu-assignment-button' : 'menu-assignment-button'}
                >
                    {menu.name}
                </button>
            )
        })

        return (
            this.state.componentActive 
                ?   <div>
                        <label htmlFor="add-menu-item-form">Enter New Item Info:</label>
                        <form id="add-menu-item-form">
                            <input 
                                type="text" 
                                placeholder="Name"
                                id="nameInput"
                                value={this.state.nameInput}
                                onChange={this.handleInputChange}
                                // required
                            />
                            <br />

                            <input 
                                type="text" 
                                placeholder="Description"
                                id="descriptionInput"
                                value={this.state.descriptionInput}
                                onChange={this.handleInputChange}
                            />
                            <br />

                            <input 
                                type="number" 
                                placeholder="Cost"
                                id="costInput"
                                value={this.state.costInput}
                                onChange={this.handleInputChange}
                            />
                            <br />

                            <label 
                                className="mt-2 mb-0" 
                                htmlFor="menuSelection"
                            >
                                Select Menus
                            </label>
                            <div 
                                className="menu-selection" 
                                id="menuSelection"
                            >
                                {menuList}
                            </div>

                            <button onClick={this.saveMenuItem}>
                                Add Item
                            </button>

                            {this.state.showInputErrorMsg && 
                                <Alert 
                                    color="info" 
                                    className="admin-alert"
                                >
                                    At the minimum, please enter an item name and assign it to a menu
                                </Alert>
                            }
                        </form>
                    </div>
                :   <button onClick={this.createNewMenuItemClick}>
                        Create a New Menu Item
                    </button>
        )
    }
}