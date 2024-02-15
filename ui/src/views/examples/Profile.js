
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "../../components/Headers/UserHeader.js";
// import { useSelector } from 'react-redux';
import { connect } from 'react-redux';

class Profile extends React.Component {


  render() {
    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={e => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={require("../../assets/img/theme/team-4-800x800_1.jpg")}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardBody className="pt-0 pt-md-4 mt-5">
                  <div className="text-center mt-6">
                    <h3>
                      {/* {localStorage.getItem("username")} */}
                      {this.props?.decodedData?.email}
                      {/* <span className="font-weight-light ">, 27</span> */}
                    </h3>
                    <div className="h5 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      { ` Department - ${this.props?.decodedData?.department}` }
                    </div>
                    <div className="h5 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                      { ` Role - Approver` }
                    </div>
                    <div>
                      <i className="ni education_hat mr-2" />
                      { ` Organization - ${this.props?.decodedData?.orgName}` }
                    </div>

{/* 
                    localStorage.setItem("username", payload.username)
          localStorage.setItem("userType", payload.type)
          localStorage.setItem("email", payload.email)
          localStorage.setItem("org", payload.org)
          localStorage.setItem("department", payload.department) */}
                    {/* <hr className="my-4" />
                    <p>
                      Ryan — the name taken by Melbourne-raised, Brooklyn-based
                      Nick Murphy — writes, performs and records all of his own
                      music.
                    </p>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      Show more
                    </a> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        Settings
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="lucky.jesse"
                              id="input-username"
                              placeholder="Username"
                              type="text"
                              value={this.props?.decodedData?.email}
                              disabled={true}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="jesse@example.com"
                              type="email"
                              value={this.props?.decodedData?.email}
                              disabled={true}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      {/* <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              First name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Lucky"
                              id="input-first-name"
                              placeholder="First name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Last name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Jesse"
                              id="input-last-name"
                              placeholder="Last name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row> */}
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                   </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  decodedData: state?.User?.login?.decodedData, // Replace with the actual state key
});

// export default Profile;

export default connect(mapStateToProps)(Profile);