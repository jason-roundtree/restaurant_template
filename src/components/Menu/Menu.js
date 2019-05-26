import React from 'react';
import axios from 'axios'
import MenuItem from './MenuItem'
import './Menu.css'
const { API_BASE_URL } = require('../../config');

export default class Menu extends React.Component { 
    state = {
        menuId: window.location.pathname.split('/')[2],
        menuName: '',
        menuItems: []
    }
    componentDidMount() {
        axios.get(`${API_BASE_URL}/menu/${this.state.menuId}`)
            .then(res => {
                this.setState({
                    menuItems: res.data.menuItems,
                    menuName: res.data.name
                })
            })
            .catch(err => console.log(err))
    }
    render() {
        const menuItems = this.state.menuItems.map(item => {
            return <MenuItem item={item} />
        })

        return ( 
            <div class="menu-page">
                <h1>{this.state.menuName}</h1>

                <div className="menu-item_container">
                    {menuItems}
                </div>
            </div>
        )
    }
}

