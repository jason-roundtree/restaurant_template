import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Menu from './Menu';
import Contact from './Contact';
import Gallery from './Gallery';
import Order from './Order';
import AdminDashboard from './AdminDashboard';
// import Reservations from './Reservations';

const Router = () => {
    return (
        <div>
            <Route exact={true} path="/" component={Home} />
            <Route path="/about" component={About} />
            {/* <Route path="/menus" component={Menus} /> */}
            <Route path="/contact" component={Contact} />
            <Route path="/order" component={Order} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/menu/:id" component={Menu} />
        </div>
    )
}

export default Router;