import React from 'react';
import { MenuAssignmentList } from './MenuAssignmentList' 
import { EditMenuButton } from './EditMenuButton' 

export default class MenuItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentItem: '',
            editMode: false
        }
    }
    toggleEditMode = id => {
        this.setState({
            // currentItem: id,
            // editMode: !this.state.editMode
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
                            // editMode={this.state.editMode}
                        />
                        
                        {/* <EditMenuButton menuItem={item.id} /> */}
                        <button 
                            onClick={() => this.props.onClick(item.id)}
                        >
                            {item.editable ? 'Save' : 'Edit'}
                        </button>

                    </li>
                </div>
            )
        })

        return menuItems
    }
}