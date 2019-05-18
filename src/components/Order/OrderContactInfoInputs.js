import React from 'react';

export default function OrderContactInfoInputs(props) {
    return (
        <div>
            <button 
                onClick={() => props.returnToOrderEdit()}
            >Return to Menu Items</button>
            <br />
            
            {/* TODO: Add validation library for phone */}
            <p>Please complete contact info before finalizing order:</p>
            <input 
                type="text"
                placeholder="First Name"
                name="firstName"
                value={props.firstName}
                onChange={props.handleInputChange}
            />
            <br />

            <input 
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={props.lastName}
                onChange={props.handleInputChange}
            />
            <br />

            <input 
                // TODO: uncomment these once order posting is working
                type="tel"
                // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="Phone Number:  XXX-XXX-XXXX"
                name="phone"
                value={props.phone}
                onChange={props.handleInputChange}
                // required
            />
            <br />
        </div>
    )
}
