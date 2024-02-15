

import React, { useEffect, useState } from 'react'
import {
  Button, TabContent, TabPane, Card, CardHeader, Label, FormGroup, CardBody, NavItem, NavLink, Nav,
  Progress, CardText, Table, Container, CardTitle, Row, Col, Input, FormFeedback,
} from "reactstrap";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { useHistory } from 'react-router-dom'
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import * as AgreementAction from '../../actions/agreement'
import { useToasts } from 'react-toast-notifications'
import dateFormat from 'dateformat';

import Header from "../../components/Headers/Header.js";
import InProgressContract from './InProgressContract.js';
import CompletedContract from './CompletedContract.js';
import ExpiringContracts from './ExpiringContracts.js';
import ContractView from './ContractView.js';
import AddContract from './AddContract.js';
import AllContracts from './AllContracts.js';
import { routes, headers } from '../../helper/config';
import axios from 'axios'
import ProgressBar from './ProgressBar'
// const dateFormat = require('dateformat');




export default function ContractHistory(props) {
  let history = useHistory();
  const dispatch = useDispatch();
  const [historyData, setHistoryData] = useState([])
  const [contractId, setContractId] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  const isLoading = useSelector((state) => state.Agreement.isLoading);

  const getContractHistory = () => {
    
    setIsValidating(true)
    if (!contractId || contractId == "") {

      return
    }

    dispatch(AgreementAction.getAgreementHistory(contractId)).then((data)=> {
      setHistoryData(data)
    }).catch(err => {
      alert(err)
    })


    // let url = `${routes.getContractHistory}args=["${contractId}"]`
    // console.log(url)
    // setIsLoading(true)
    // axios.get(url, headers())
    //   .then(response => {
    //     setIsLoading(false)

    //     console.log(response.data.result)
    //     setHistoryData(response.data.result)
    //     if(!response.data.result.length){
    //       alert(`No Data Found for contract Id : ${contractId}`)
    //     }
    //   }).catch(err => {
    //     setIsLoading(false)

    //     console.log(err)
    //   })
  }

  const inputChangeHandler = (value, fieldName) => {
    if (fieldName == "id") {
      setContractId(value)
    }

  }


  return (
    <>
      <Header />
      <Container className="mt--7" fluid>

        <Row>
          <div className="col">

            <Card className="shadow">
              <CardHeader className="border-0">
                <FormGroup row>
                  <Col sm={9}>
                    <h3 className="mb-0">Contract List</h3>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={5}>
                    <Input invalid={isValidating && contractId == ''} onChange={e => { inputChangeHandler(e.target.value, 'id') }} placeholder="Enter Contract ID " />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                  {/* <Col sm={1}>
                    <Label>: </Label>
                  </Col> */}
                  <Col sm={3}>
                    <Button className="my-1" color="primary" onClick={() => { getContractHistory() }} type="button">{"Show History"}</Button>
                  </Col>
                </FormGroup>
                {isLoading? 
                <FormGroup row>
                  <Col sm={9}>
                    <ProgressBar/>
                  </Col>
                </FormGroup>
                :""}
              </CardHeader>
              <div>
                <Card className="bg-secondary px-md-2">
                  {historyData && historyData.length ?
                    historyData?.map(contract => {
                      return (
                        <div>
                          <Card className="py-4 px-md-4">
                            <FormGroup row>
                              <Col sm={2}>
                                <Label>Transaction Id</Label>
                              </Col>
                              <Col sm={1}>
                                <Label>: </Label>
                              </Col>
                              <Col sm={9}>
                                <Label>{contract.txId}</Label>
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col sm={2}>
                                <Label>Time</Label>
                              </Col>
                              <Col sm={1}>
                                <Label>: </Label>
                              </Col>
                              <Col sm={9}>
                                <Label>{contract.timeStamp}</Label>
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col sm={2}>
                                <Label>Details</Label>
                              </Col>
                              <Col sm={1}>
                                <Label>: </Label>
                              </Col>
                              <Col sm={9}>
                                {/* <Card className="bg-secondary px-md-2"> */}
                                <Card className="py-4 px-md-4">
                                  <FormGroup row>
                                    <Col sm={3}>
                                      <Label>Title</Label>
                                    </Col>
                                    <Col sm={1}>
                                      <Label>: </Label>
                                    </Col>
                                    <Col sm={8}>
                                      <Label>{contract.title}</Label>
                                    </Col>
                                  </FormGroup>
                                  <FormGroup row>
                                    <Col sm={3}>
                                      <Label >Status</Label>
                                    </Col>
                                    <Col sm={1}>
                                      <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                      <Label for="exampleEmail" >{contract.status}</Label>
                                    </Col>
                                  </FormGroup>
                                  <FormGroup row>
                                    <Col sm={3}>
                                      <Label >First Party</Label>
                                    </Col>
                                    <Col sm={1}>
                                      <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                      <Label for="exampleEmail" >{contract.firstParty}</Label>
                                    </Col>
                                  </FormGroup>
                                  <FormGroup row>
                                    <Col sm={3}>
                                      <Label >Current Owner</Label>
                                    </Col>
                                    <Col sm={1}>
                                      <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                      <Label for="exampleEmail" >{contract.owner}</Label>
                                    </Col>
                                  </FormGroup>
                                  <FormGroup row>
                                    <Col sm={3}>
                                      <Label >Second Party</Label>
                                    </Col>
                                    <Col sm={1}>
                                      <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                      <Label for="exampleEmail" >{contract.secondParty}</Label>
                                    </Col>
                                  </FormGroup>
                                  <FormGroup row>
                                    <Col sm={3}>
                                      <Label >Start Date</Label>
                                    </Col>
                                    <Col sm={1}>
                                      <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                      <Label  >{dateFormat(contract.startDate, "yyyy-mm-dd")}</Label>
                                    </Col>
                                  </FormGroup>
                                  <FormGroup row>
                                    <Col sm={3}>
                                      <Label >End Date</Label>
                                    </Col>
                                    <Col sm={1}>
                                      <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                      <Label  >{dateFormat(contract.endDate, "yyyy-mm-dd")}</Label>
                                    </Col>
                                  </FormGroup>
                                  <FormGroup row>
                                    <Col sm={3}>
                                      <Label >Agrement File Name</Label>
                                    </Col>
                                    <Col sm={1}>
                                      <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                      <Label src={contract.document.name} >{"Open File"}</Label>
                                    </Col>
                                  </FormGroup>
                                  <FormGroup row>
                                    <Col sm={3}>
                                      <Label >Agrement File</Label>
                                    </Col>
                                    <Col sm={1}>
                                      <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                      <a href={contract.document.url} target="_blank">Show File</a>
                                    </Col>
                                  </FormGroup>
                                </Card>
                              </Col>
                            </FormGroup>


                          </Card>
                        </div>)

                    })
                    : null}
                </Card>

              </div>
            </Card>
          </div>
        </Row>


      </Container>
    </>
  );
}
