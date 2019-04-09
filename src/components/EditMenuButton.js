import React from 'react'
import { Button } from 'reactstrap';

export const EditMenuButton = props => {
    let menuItemId = props.menuItem
    return (
        <Button color="primary">
            {/* {props.item.editable ? 'Save' : 'Edit'} */}
        </Button>
    )
}
