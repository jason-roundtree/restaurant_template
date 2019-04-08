import React from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';
const { API_BASE_URL } = require('../config');

export default class AddMenuItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            componentActive: false,
            showInputErrorMsg: false,
            showSuccessMsg: false,
            activeMenus: [],
            nameInput: '',
            descriptionInput: '',
            costInput: ''
        }
    }
    toggleMenuAssignment = menuId => {
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
            // TODO: move this code and input state to AdminDashboard or crate a shared parent component
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
    // componentDidUpdate() {
    //     console.log('STATE', this.state)
    // }
    render() {
        const menuList = this.props.menus.map(menu => {
            return (
                <li
                    key={menu.id}
                    id={menu.id}
                    onClick={() => this.toggleMenuAssignment(menu.id)}
                    className={this.state.activeMenus.includes(menu.id) ? 'selectedMenu' : ''}
                >
                    {menu.name}
                </li>
            )
        })
        return (
            <div>
                <button onClick={this.createNewMenuItemClick}>
                    Create New Menu Item
                </button>

                <form 
                    id="addMenuItem" 
                    className={!this.state.componentActive ? 'hidden' : ''}
                >
                    {/* TODO: Create editMenuInput component for these?? */}
                    <label htmlFor="nameInput">Item Name</label>
                    <input 
                        type="text" 
                        id="nameInput"
                        value={this.state.nameInput}
                        onChange={this.handleInputChange}
                        required
                    />
                    <br />

                    <label htmlFor="descriptionInput">Description</label>
                    <input 
                        type="text" 
                        id="descriptionInput"
                        value={this.state.descriptionInput}
                        onChange={this.handleInputChange}
                        required
                    />
                    <br />

                    <label htmlFor="costInput">Cost</label>
                    <input 
                        type="number" 
                        id="costInput"
                        value={this.state.costInput}
                        onChange={this.handleInputChange}
                        required
                    />
                    <br />

                    <label htmlFor="menuSelection">Select Menus</label>
                    <ul className="menu-selection" id="menuSelection">
                        {menuList}
                    </ul>
                    <button onClick={this.saveMenuItem} form="addMenuItem">
                        Add Item
                    </button>
                </form>
                
                {this.state.showInputErrorMsg ? <p className='error-msg'>At the minimum, please enter an item name and assign it to a menu</p> : ''}

                {this.state.showSuccessMsg && !this.state.componentActive ? <p className='success-msg'>The menu item has successfully been added</p> : ''}
                
            </div>
        )
    }
}