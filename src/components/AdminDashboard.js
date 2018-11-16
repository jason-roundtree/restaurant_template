import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css'
const axios = require('axios');
const { API_BASE_URL } = require('../config');

export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: [],
            menuItems: [],
            filterInput: ''
        }
    }
    componentDidMount() {
        // GET menus
        axios.get(`${API_BASE_URL}/menus`)
          .then(res => {
            const menus = res.data.map(menu => {
                return {
                    name: menu.name, 
                    id: menu._id
                }
            })
            this.setState({
              menus
            })
          })
          .catch(err => {
            console.log(err)
          });

          // GET all menu items
          axios.get(`${API_BASE_URL}/menu_items`)
            .then(res => {
                const menuItems = res.data.map(item => {
                    return {
                        name: item.name, 
                        description: item.description,
                        cost: item.cost,
                        menus: item.menus,
                        id: item._id
                    }
                })
                this.setState({
                    menuItems
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    handleInput = e => {
        this.setState({
            filterInput: e.target.value
        })
    }
    handleMenuAssignment = e => {
        console.log('e: ', e.target.parentNode.parentNode)
        // TODO: Should I add IDs to the menus instead of looking up menu id by name?? Should I store some of this in state??
        let menuItemId = e.target.parentNode.parentNode.getAttribute('id')
        console.log('menuItemId: ', menuItemId)
        let menuName = e.target.textContent
        console.log('menuName: ', menuName)
        let menuId = { menuId: ''}
        console.log('menuId: ', menuId)
        let menus = this.state.menus
        console.log('menu: ', menus)
        for (let i = 0; i < menus.length; i++) {
            if (menus[i].name === menuName) {
                menuId.menuId = menus[i].id
            }
        }
        
        axios.put(`${API_BASE_URL}/menu_items/${menuItemId}`, menuId)
            .then(res => {
                console.log('PUT response: ', res)
            })
            .catch(err => {
                console.log(err)
            });
    }
    componentDidUpdate() {
        console.log('state: ', this.state)
    }
    render() {
        const menus = this.state.menus.map((menu, index) => {
            return (
                <div>
                    <Link to={`/menu/${menu.id}`}>
                        <li key={index}>{menu.name}</li>
                    </Link>
                    <br />
                </div> 
            )
        })
        const menuSelection = this.state.menus.map((menu, index) => {
            return (
                <li 
                    key={index} 
                    onClick={this.handleMenuAssignment}
                >
                    {menu.name}
                </li>
            )                
        })
        const menuItems = this.state.menuItems.map((menuItem, index) => {
            console.log('menuItem: ', menuItem)
            return (
                <li 
                    key={index}
                    id={menuItem.id}
                >
                    <p>{menuItem.name}</p>
                    <p>{menuItem.description}</p>
                    <p>&#36;{menuItem.cost}</p>
                    <ul className="menu-selection">{menuSelection}</ul>
                </li>
            )
        })
        let filteredItems = this.state.menuItems.filter(item => {
            return item.name.toLowerCase().includes(this.state.filterInput.toLowerCase())
        })
        filteredItems = filteredItems.map((item, index) => {
            return (
                <li 
                    key={index}
                    id={item.id}
                >
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <p>&#36;{item.cost}</p> 
                    <ul className="menu-selection">{menuSelection}</ul>
                </li>
            )  
        })
        
        return (
            <div>

                <h2>Menus</h2>
                <button>Create New Menu</button>
                <p><i>Select a menu to make edits</i></p>
                <ul className="menus">{menus}</ul>
                
                <h2>All Menu Items</h2>
                <button>Create New Menu Item</button>
                <br />
                <label htmlFor="filter">Filter By Name</label>
                <input 
                    type="text" 
                    id="filter" 
                    onChange={this.handleInput}
                    value={this.state.input}
                />
                <ul className="menu-items">{
                    this.state.filterInput !== '' 
                        ? filteredItems
                        : menuItems
                }</ul>

            </div>
        )
    }
}