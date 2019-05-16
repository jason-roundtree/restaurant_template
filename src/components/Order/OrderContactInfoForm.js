 import React, { Component } from 'react'
import { Formik } from 'formik';

export default class OrderContactInfoForm extends Component {
    // state = {
    //     firstName: '',
    //     lastName: '',
    //     phoneNumber: '',

    // }
    
    render() {
        // console.log('OrderForm state: ', this.state)
        return (
            // TODO: Is form necessary?
            <form onSubmit={this.props.handleSubmit}>

                <input 
                    type="input"
                    name="customerFirstName"
                    value={this.props.firstName}
                    onChange={this.props.handleInputChange}
                    placeholder="First Name"
                    required
                />
                <br />

                <input 
                    type="input"
                    name="customerLastName"
                    value={this.props.lastName}
                    onChange={this.props.handleInputChange}
                    placeholder="Last Name"
                    required
                />
                <br />

                <input 
                    type="input"
                    name="customerPhone"
                    value={this.props.phone}
                    onChange={this.props.handleInputChange}
                    placeholder="Phone Number"
                    required
                />
                <br />

                <button>Submit</button>
            </form>
        )
    }
}
