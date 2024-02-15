import React from 'react'
import { Card, CardTitle, Button, CardText } from 'reactstrap'

export default function NoDataCard(props) {

    let message = props.status=="Users"? "No user list available for your organization" : `We have no contract data found for ${props.status} status`
    return (
        <div>
            <Card body inverse color="primary">
                <CardTitle>No Data Found !</CardTitle>
                <CardText>{message} </CardText>
                {/* <Button color="secondary">Button</Button> */}
            </Card>

        </div >
    )
}
