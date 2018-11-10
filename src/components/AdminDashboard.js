import React from 'react';
const axios = require('axios');
const { API_BASE_URL } = require('../config');

export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: [],

        }
    }
    componentDidMount() {
        // GET menus
        axios.get(`${API_BASE_URL}/menus`)
          .then(res => {
            console.log('resMenus: ', res)
            const menus = res.data
            
            this.setState({
            //   leagues
            });
          })
          .catch(err => {
            console.log(err);
          });
    }
    render() {
        return (
            <h1>Admin</h1>
        )
    }
}