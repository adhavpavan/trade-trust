
import React from 'react'

import ContractListView from './ContractListView.js';

function InProgressContract() {
    return (
        <>
            <ContractListView status="inprogress" title="InProgress Contract List"/>
        </>
    );
}

export default InProgressContract
