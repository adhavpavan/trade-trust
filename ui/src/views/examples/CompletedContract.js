import React from 'react'
import ContractListView from './ContractListView.js';

function CompletedContract() {
    return (
        <>
            <ContractListView status="active" title="Contract List With Completed Status"/>
        </>
    );
}

export default CompletedContract
