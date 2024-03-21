
import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, Col, Container, FormGroup, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";

// import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';

import Header from "../components/Headers/Header.js";

import { useSelector } from 'react-redux';
import VerifyDocument from './examples/AddLot.js';
import LotList from './examples/LotList.js';
const axios = require('axios')
const config = require('../helper/config.js')


export default function VerifyPage() {
  let history = useHistory()

  const userData = useSelector((state) => state?.User?.login?.decodedData)

  const [activeTab, setActiveTab] = useState('1');

  const selectActiveTab = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  useEffect(() => {
    if (!userData) {
      history.push('auth/login');
    }
  }, [])

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);


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
                    <h3 className="mb-0">Verify...</h3>
                  </Col>
                  <Col sm={3}>
                    <Button className="my-1" color="primary" onClick={toggleModal} type="button">{"Verify..."}</Button>
                  </Col>
                </FormGroup>
                <VerifyDocument toggle={toggleModal} modal={modal} />
              </CardHeader>
              <div>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => { selectActiveTab('1'); }}
                    >
                      Lots
                    </NavLink>
                  </NavItem>
                </Nav>


                <TabContent activeTab={activeTab}>
                  {activeTab == "1" ?
                    <TabPane tabId="1">
                      <Row>
                        <Col sm="12">

                          <LotList />
                          {/* <ExpiringContracts /> */}

                        </Col>
                      </Row>
                      {/* <Row>
                        <Col sm="12" style={{ paddingTop: 100 }}>
                          <Card body>
                            <InProgressContract />
                          </Card>
                        </Col>
                      </Row> */}
                    </TabPane> : <></>
                  }
                </TabContent>
              </div>
            </Card>
          </div>
        </Row>


      </Container>
    </>
  );
}
