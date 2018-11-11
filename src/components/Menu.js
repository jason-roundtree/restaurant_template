import React from 'react';
import { connect } from 'react-redux';

export const Menu = (props) => { 
    const menuItems = props.menu.map((item, index) => {
        return (
            <li key={index} className="menu-item">
                <p>{item.name}</p>
                <p>{item.description}</p>
                <p>&#36;{item.cost}</p>
            </li>
        )
    })
    return (
        <div>
            <h1>{`{menuType} Menu`}</h1>
            <ul className="menu-items">{menuItems}</ul>
        </div>
    ) 
}

function mapStateToProps(state) {
    return {
      menu: state.menu
    }
}
  
export default connect(mapStateToProps)(Menu);