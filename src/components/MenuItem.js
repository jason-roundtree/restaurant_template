import React from 'react';
import { MenuAssignmentList } from './MenuAssignmentList' 

export default class MenuItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editMode: false
        }
    }
    toggleEditMode = () => {
        this.setState({
            editMode: !this.state.editMode
        })
    }
    componentDidUpdate() {
        console.log('MenuItem state: ', this.state)
    }
    render () {
        let menuItems = this.props.menuItems.map((item, index) => {
            return (
                <div>
                    <li 
                        key={index}
                        id={item.id}
                        className="menu-item"
                    >

                        <p>{item.name}</p>
                        <p>{item.description}</p>
                        <p>&#36;{item.cost}</p>

                        <MenuAssignmentList 
                            menus={this.props.menus}
                            handleMenuAssignment={this.props.handleMenuAssignment}
                            editMode={this.state.editMode}
                        />
                        
                    <button 
                        onClick={() => {
                            this.props.onClick(item.id)
                            this.toggleEditMode()
                        }}
                    >
                        {this.state.editMode ? 'Save' : 'Edit'}
                    </button>

                    </li>
                </div>
            )
        })

        return menuItems
    }
}