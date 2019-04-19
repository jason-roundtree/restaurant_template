import React from 'react';
import axios from 'axios'
import './Menu.css'
const { API_BASE_URL } = require('../config');


class Menu extends React.Component { 
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
        console.log('Menu state: ', this.state)
        console.log('menu params id', this.props.match.params.id)
        const menuItems = this.state.menuItems.map(item => {
            return (
                <div 
                    key={item._id}
                    className="menu-item"
                >
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <p>{item.cost ? `$${item.cost.toFixed(2)}` : ''}</p>
                </div>
            )
        })

        return ( 
            <div>
                <h1>{this.state.menuName}</h1>

                <div className="menu-item_container">
                    {menuItems}
                </div>
            </div>
        )
    }
    
    // const menuItems = props.menu.map((item, index) => {
    //     return (
    //         <li key={index} className="menu-item">
    //             <p>{item.name}</p>
    //             <p>{item.description}</p>
    //             <p>&#36;{item.cost}</p>
    //         </li>
    //     )
    // })
    // return (
    //     <div>
    //         <h1>{`{menuType} Menu`}</h1>
    //         <ul className="menu-items">{menuItems}</ul>
    //     </div>
    // ) 
}

export default Menu;

