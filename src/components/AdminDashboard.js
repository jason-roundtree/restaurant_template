import React from 'react';
import './AdminDashboard.css'
const axios = require('axios');
const { API_BASE_URL } = require('../config');


export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: [],
            menuItems: []
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
                        cost: item.cost
                    }
                })
                this.setState({
                    menuItems
                })
            })
            .catch(err => {
                console.log(err)
            });
    }
    // componentDidUpdate() {
    //     console.log('state: ', this.state)
    // }
    render() {
        const menuList = this.state.menus.map((menu, index) => {
            return <li>{menu.name}</li>
        })
        const menuItems = this.state.menuItems.map((menuItem, index) => {
            return (
                <li>
                    <p>{menuItem.name}</p>
                    <p>{menuItem.description}</p>
                    <p>{menuItem.cost}</p>
                </li>

            )
        })
        return (
            <div>

                <h2>Menus</h2>
                <button>Create New Menu</button>
                <ul>{menuList}</ul>
                
                <h2>Menu Items</h2>
                <button>Create New Menu Item</button>
                {/* TODO: complete filter functionality */}
                <br />
                <label for="filter">Filter By Name</label>
                <input type="text" id="filter" />
                <ul className="menu-items">{menuItems}</ul>

            </div>
        )
    }
}