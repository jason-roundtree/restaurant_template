import React from 'react';
import { Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import './NavBar.css';

const NavBar = () => {
    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand>
                    <Link to="/home">Restaurant Name</Link>
                </NavbarBrand>
                <NavbarToggler />
                <Collapse navbar>
                    <Nav navbar className="ml-auto">
                    {/* <NavItem>
                        <Link to="/home">Home</Link>
                    </NavItem> */}
                        <NavItem>
                            <Link to="/about">About</Link>
                        </NavItem>

                        <NavItem>
                            <Link to="/menu">Menu</Link>
                        </NavItem>

                        <NavItem>
                            <Link to="/contact">Contact</Link>
                        </NavItem>

                        <NavItem>
                            <Link to="/order">Order</Link>
                        </NavItem>
                        {/* Reservations */}
                        <NavItem>
                            <Link to="/gallery">Gallery</Link>
                        </NavItem>
                        {/* Store */}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    )
}

export default NavBar;
