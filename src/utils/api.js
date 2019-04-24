import axios from "axios";
// TODO: Not currently implemented or connected
// help - https://codeburst.io/how-to-call-api-in-a-smart-way-2ca572c6fe86

// TODO: not sure if url should be passed in or just imported
// const { API_BASE_URL } = require('../config');

export default {
    menus(url) {
        return {
            getAll: () => axios.get(`${url}/menus`),
            postMenu: () => axios.post(`${url}/menu`),
            // TODO: no end point yet
            deleteMenu: (id) => axios.delete`${url}/menu/${id}`
        }
    },
    menuItems(url) {
        return {
            getAll: () => axios.get(`${url}/menu_items`),
            deleteOne: (id) => axios.delete(`${url}/menu_items/${id}`),
            updateOne: (id) => axios.put(`${url}/menu_items/${id}`),
        }
        
    }
    
}

// update menu name
// delete menu
// update contact info
// delete contact info
// update restaurant info
// create new user
// update user (name, email, reset password, active/inactive/permissions)
// delete user