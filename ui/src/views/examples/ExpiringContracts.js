import React, { useEffect, useState } from 'react'
import { Button, TabContent, TabPane, Card, CardHeader, CardBody, NavItem, NavLink, Nav, Progress, CardText, Table, Container, CardTitle, Row, Col } from "reactstrap";

// import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { useHistory } from 'react-router-dom'
import classnames from 'classnames';

import Header from "../../components/Headers/Header.js";
import ContractListView from './ContractListView.js';
const axios = require('axios')
const config = require('../../helper/config.js')

function ExpiringContracts() {


    return (
        <>

            <ContractListView status="expiring-soon" title="Expiring Contract List within 30 Days"/>
        </>
    );
}

export default ExpiringContracts
