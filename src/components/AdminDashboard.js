import React from 'react';
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
                        cost: item.cost
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
    componentDidUpdate() {
        console.log('state: ', this.state)
    }
    render() {
        const menus = this.state.menus.map((menu, index) => {
            return <li key={index}>{menu.name}</li>
        })
        const menuItems = this.state.menuItems.map((menuItem, index) => {
            return (
                <li key={index}>
                    <p>{menuItem.name}</p>
                    <p>{menuItem.description}</p>
                    <p>&#36;{menuItem.cost}</p>
                </li>
            )
        })
        let filteredItems = this.state.menuItems.filter(item => {
            return item.name.toLowerCase().includes(this.state.filterInput.toLowerCase())
        })
        filteredItems = filteredItems.map((item, index) => {
            return (
                <li key={index}>
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <p>&#36;{item.cost}</p>
                </li>
            )  
        })
        console.log('filteredItems: ', filteredItems)
        return (
            <div>

                <h2>Menus</h2>
                <button>Create New Menu</button>
                <ul>{menus}</ul>
                
                <h2>Menu Items</h2>
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