import React, { Component } from 'react'
import { Formik } from 'formik';

export default class OrderForm extends Component {
    state = {
        firstName: '',
        lastName: '',
        phoneNumber: '',

    }
    handleInputChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>

                <input 
                    type="input"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.handleInputChange}
                    placeholder="First Name"
                />
                <br />

                <input 
                    type="input"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.handleInputChange}
                    placeholder="Last Name"
                />
                <br />

                <input 
                    type="input"
                    name="phoneNumber"
                    value={this.state.phoneNumber}
                    onChange={this.handleInputChange}
                    placeholder="Phone Number"
                />
                <br />

                <button>Submit</button>
            </form>
        )
    }
}
