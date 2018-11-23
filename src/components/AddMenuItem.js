import React from 'react';
import { MenuAssignmentList } from './MenuAssignmentList';

export default class AddMenuItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            componentActive: false,
            menusAssigned: []
        }
    }
    handleButtonClick = () => {
        
    }
    handleMenuAssignment = () => {

    }
    render() {
        return (
            <div>
                <button
                    onClick={this.handleButtonClick}
                >
                    Create New Menu
                </button>

                <form>
                    <label htmlFor="menu-name">Item Name</label>
                    <input 
                        type="text" 
                        id="menu-name"
                    />
                    <br />
                    <label htmlFor="menu-description">Description</label>
                    <input 
                        type="text" 
                        id="menu-description"
                    />
                    <br />
                    <label htmlFor="menu-cost">Cost</label>
                    <input 
                        type="text" 
                        id="menu-cost"
                    />
                    <ul className="menu-selection">
                        <MenuAssignmentList 
                            menus={this.props.menus}
                            activeMenus={''}
                        />
                    </ul>
                    
                </form>
                

            </div>
            
        )
    }
}