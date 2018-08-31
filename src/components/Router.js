import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Menu from './Menu';
import Contact from './Contact';
import Gallery from './Gallery';
import OrderPickup from './OrderPickup';
// import Reservations from './Reservations';


const Router = () => {
    return (
        <div>
            <Route path="/home" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/menu" component={Menu} />
            <Route path="/contact" component={Contact} />
            <Route path="/pickup" component={OrderPickup} />
            <Route path="/gallery" component={Gallery} />
        </div>
    )
}

export default Router;