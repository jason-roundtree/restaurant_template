import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <div>
            <nav>
                <h1>Restaurant Name</h1>
                <ul>
                    <Link to="/home"><li>Home</li></Link>
                    <Link to="/about"><li>About</li></Link>
                    <Link to="/menu"><li>Menu</li></Link>
                    <Link to="/contact"><li>Contact</li></Link>
                    {/* Reservations */}
                    <Link to="/order"><li>Place an Order</li></Link>
                    <Link to="/gallery"><li>Gallery</li></Link>
                    {/* Store */}
                </ul>
            </nav>
        </div>
    )
}

export default NavBar;
