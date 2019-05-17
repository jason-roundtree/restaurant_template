import React, { Component } from 'react';

export default function OrderCheckout(props) {
    return (
        <div>
            <button 
                onClick={() => {
                    props.returnToOrderEdit()
                    props.toggleCheckout()
                }}
            >Return to Menu Items</button>
            <br />
            
            {/* TODO: Add validation that disables submit btn if all fields are complete */}
            {/* TODO: Hide this section if no items have been added to order */}
            <p>Please complete contact info before finalizing order:</p>
            <input 
                type="text"
                placeholder="First Name"
                name="firstName"
                value={props.firstName}
            />
            <br />

            <input 
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={props.lastName}
            />
            <br />

            <input 
                type="text"
                placeholder="Phone Number"
                name="phone"
                value={props.phone}
            />
            <br />
        </div>
    )
}
