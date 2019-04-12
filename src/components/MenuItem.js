import React from 'react';
import { MenuAssignmentList } from './MenuAssignmentList'; 
import { Button, Card, CardImg, CardText, CardBody,
    CardTitle } from 'reactstrap';

// import burger from '../images/beef-bread-bun-1639557.jpg';

export default function MenuItem(props) {
    let menuItems = props.menuItems.map(item => {
        let activeMenus = item.menus
        return (
            <Card 
                key={item.id}
                id={item.id}
                className="menu-item-card shadow-sm"
            >
                {/* <CardImg left src={burger} /> */}
                <CardBody>
                    <CardTitle className="menu-item-name">{item.name}</CardTitle>
                    <CardText>{item.description}</CardText>
                    <CardText>{item.cost ? `$ ${item.cost.toFixed(2)}` : ''}</CardText>

                    <MenuAssignmentList 
                        menus={props.menus}
                        activeMenus={activeMenus}
                        handleMenuAssignment={props.handleMenuAssignment}
                        menuItemId={item.id}
                        menuItemEditStatus={item.editable}
                        className="menu-list"
                        buttonDisabled={!item.editable}
                    />   

                    <Button 
                        onClick={() => props.onClick(item.id)}
                        className={item.editable ? 'edit-menu' : ''}
                    >
                        {item.editable ? 'Save' : 'Edit'}
                    </Button>
                    {/* TODO: Edit mode activates modal to allow for longer text inputs and isolation */}
                    {/* TODO: Add delete button with precautions if item is in edit mode */}

                </CardBody>
            </Card>
        )
    })
    return menuItems
}