import React from 'react';
import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import './AdminDashboard.css'
const axios = require('axios');
const { API_BASE_URL } = require('../config');

export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: [],
            menuItems: [],
            filterInput: '',
            editItemId: ''
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
                let menuItems = res.data.map(item => {
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
    //     axios.put(`${API_BASE_URL}/menu_items/${menuItemId}`, menuId)
    //         // TODO: what to do with this then? Can I just do catch or is then needed first?
    //         .then(res => {
    //             console.log('PUT response: ', res)
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         });
    // }
    handleEditMenuItem = itemId => {
        console.log('menu item id ', itemId)
        this.setState({
            editItemId: itemId
        })
    }
    handleMenuAssignment = menuId => {
        console.log('menuId: ', menuId)
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

        // let filteredItems = this.state.menuItems.filter(item => {
        //     return item.name.toLowerCase().includes(this.state.filterInput.toLowerCase())
        // })
        
        return (
            <div>

                <h2>Menus</h2>
                <button>Create New Menu</button>
                {/* <p><i>Select a menu to view</i></p> */}
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
                <ul className="menu-items">
                    <MenuItem 
                        menuItems={this.state.menuItems}
                        menus={this.state.menus} 
                        onClick={this.handleEditMenuItem}
                        handleMenuAssignment={this.handleMenuAssignment}
                    />
                    {/* onClick={() => this.handleMenuAssignment()} */}
                </ul>

            </div>
        )
    }
}