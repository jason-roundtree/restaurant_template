import React from 'react';
import { 
    Button, 
    Card, 
    CardImg, 
    CardText, 
    CardBody,
    CardTitle 
   } from 'reactstrap';

export default function MenuItem(props) {
    const menuItems = props.menuItems.map(item => {
        return (
            <Card 
                key={item.id}
                id={item.id}
                className="menu-item-card"
            >
                <CardBody>
                    <CardTitle className="menu-item-name">{item.name}</CardTitle>
                    <CardText className='menu-item-description'>{item.description}</CardText>
                    <CardText className='menu-item-cost'>{item.cost ? `$${item.cost.toFixed(2)}` : ''}</CardText>
                    <CardText className="mb-0 menu-item-list-label">Menus:</CardText>
                    <ul id="active-menu-list">    
                        {item.menus.length > 0 
                            ?   item.menus.map((menu, i, array) => {
                                    return (
                                        <li key={menu.id}>
                                            {i < array.length - 1 
                                                ? `${menu.name}, `
                                                : menu.name
                                            }
                                        </li>
                                    )
                                })
                            :   <li>No menus</li>
                        }
                    </ul>
                    
                    <br />
                    <button 
                        onClick={() => props.onClick(item.id)}
                        id="edit-menu-item"
                    >
                        Edit
                    </button>
                    
                </CardBody>
            </Card>
        )
    })
    return menuItems
}