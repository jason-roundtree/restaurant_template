import React from 'react';
import { Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink } from 'reactstrap';
import utensils from '../images/utensils.svg';
import './NavBar.css';

export default class NavBar extends React.Component {
    state = {
        isOpen: false
    }
    toggle = () => {
        this.setState({
          isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
            <div>
                <Navbar className="shadow" expand="md" light>
                    <NavbarBrand tag={Link} to="/home">
                        <img 
                            src={utensils} 
                            alt="Restaurant logo" 
                            width="50px"
                            height="50px"
                        />
                        <span style={{marginLeft: '10px'}}>Restaurant Name</span>
                    </NavbarBrand>
                    
                    <NavbarToggler onClick={this.toggle}  />
                    <Collapse navbar isOpen={this.state.isOpen}>
                        <Nav navbar className="ml-auto">
                        {/* <NavItem>
                            <Link to="/home">Home</Link>
                        </NavItem> */}
                            <NavItem>
                                <NavLink tag={Link} to="/about">About</NavLink>
                            </NavItem>
    
                            <NavItem>
                                <NavLink tag={Link} to="/menus">Menus</NavLink>
                            </NavItem>
    
                            <NavItem>
                                <NavLink tag={Link} to="/contact">Contact</NavLink>
                            </NavItem>
    
                            <NavItem>
                                <NavLink tag={Link} to="/order">Order</NavLink>
                            </NavItem>
                            {/* Reservations */}
                            <NavItem>
                                <NavLink tag={Link} to="/gallery">Gallery</NavLink>
                            </NavItem>
                            {/* Store */}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}
