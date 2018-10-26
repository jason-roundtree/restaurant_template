import React from 'react';
import { connect } from 'react-redux';

export const Menu = (props) => { 
    const menuItems = props.menu.map((item, index) => {
        return (
            <li key={index}>
                <p>{item.name}</p>
                <p>{item.description}</p>
                <p>{item.cost}</p>
            </li>
        )
            
    })
    return (
        <div>
            <h1>Menu</h1>
            <ul>
                {menuItems}
            </ul>
        </div>
    ) 
}

function mapStateToProps(state) {
    return {
      menu: state.menu
    }
  }
  
export default connect(mapStateToProps)(Menu);