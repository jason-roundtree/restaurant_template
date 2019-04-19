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
        // console.log('menu item: ', item)
        // let activeMenus = item.menus
        return (
            <Card 
                key={item.id}
                id={item.id}
                className="menu-item-card shadow-sm"
            >
                <CardBody>
                    <CardTitle className="menu-item-name">{item.name}</CardTitle>
                    <CardText>{item.description}</CardText>
                    <CardText>{item.cost ? `$${item.cost.toFixed(2)}` : ''}</CardText>
                    <p className="mb-0">Menus:</p>
                    <ul id="active-menu-list">    
                        {item.menus.length > 0 
                            ?   item.menus.map(menu => {
                                    return (
                                        <li key={menu.id}>
                                            {menu.name}
                                        </li>
                                    )
                                })
                            :   <li>No menus</li>
                        }
                    </ul>

                    <Button onClick={() => props.onClick(item.id)}>
                        Edit
                    </Button>
                    
                </CardBody>
            </Card>
        )
    })
    return menuItems
}