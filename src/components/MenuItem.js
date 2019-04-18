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
                        {item.menus.map(menu => {
                            return (
                                // TODO: needs work for when menus haven't been assigned
                                <li key={menu.id}>
                                    {menu.name === 'null' ? 'No menus' : menu.name}
                                </li>
                            )
                        })}
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