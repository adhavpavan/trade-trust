import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  CustomInput,
  Label,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import ProgressBar from "./ProgressBar";
import axios from "axios";
import { routes } from "../../helper/config.js";
// import jwt from 'jsonwebtoken'

import { useDispatch, useSelector } from "react-redux";
import * as UserAction from "../../actions/user";
import { useToasts } from "react-toast-notifications";

export default function Register2() {
  let history = useHistory();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignInFailed, setIsSignInFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [isLegalDepartment, setIsLegalDepartment] = useState(true);
  const [isFinancialDepartment, setIsFinancialDepartment] = useState(false);

  const { addToast } = useToasts();

  // useEffect(() => {
  //   let token = localStorage.getItem('token')
  //   console.log(`Token is =============:${token}`)
  //   if (token) {
  //     history.push('/admin/index')
  //   }
  // }, [])

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleDropdownItemClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(!dropdownOpen);
    toggle();
  };

  const inputChangeHandler = (value, fieldName) => {
    switch (fieldName) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "isLegalDepartment":
        if (!isLegalDepartment) {
          setIsLegalDepartment(!isLegalDepartment);
          console.log(`Legal Dept value is : ${isLegalDepartment}`);
          if (isFinancialDepartment) {
            setIsFinancialDepartment(false);
          }
        }

        break;
      case "isFinantialDepartment":
        if (!isFinancialDepartment) {
          setIsFinancialDepartment(!isFinancialDepartment);
          console.log(`Financial Dept value is : ${isFinancialDepartment}`);
          if (isLegalDepartment) {
            setIsLegalDepartment(false);
          }
        }

        break;
      default:
        break;
    }

    console.log(`input changing`);
  };

  const resetInput = () => {
    setEmail("");
    setPassword("");
    setIsLegalDepartment(true);
    setIsFinancialDepartment(false);
    setIsSignInFailed(false);
    setFailedMessage("");
  };

  const createAccount = () => {
    console.log(`Legal Dept value is : ${isLegalDepartment}`);
    console.log(`Financial Dept value is : ${isFinancialDepartment}`);

    if (!selectedOption) {
      addToast("please select organization", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    // ToDo: need to change org id for each org
    let userData = {
      email: email,
      name: username,
      password: password,
      orgId: selectedOption === "Org 1" ? 1 : 2,
      department: isLegalDepartment ? "legal" : "financial",
    };

    dispatch(UserAction.registerUser(userData))
      .then((resp) => {
        console.log("response from api=================", resp);
        resetInput();
        alert(resp?.message);
      })
      .catch((err) => {
        console.log("error response from api=================", err);
        // alert(err)
        setIsSignInFailed(true);
        setFailedMessage(err);
      });

    // console.log(userData)

    // setIsLoading(true)
    // setIsSignInFailed(false)
    // axios.post(routes.register, userData)
    //   .then(response => {
    //     setIsLoading(false)

    //     if (response.data.success) {
    //         alert(response.data.result.message)
    //     } else {
    //       setIsSignInFailed(true)
    //       setFailedMessage(response.data.error)
    //     }

    //   })
    //   .catch(err => {
    //     setIsLoading(false)
    //     alert(err)
    //   })
  };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign up with credentials</small>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Username"
                    onChange={(e) => {
                      inputChangeHandler(e.target.value, "username");
                    }}
                    type="text"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    onChange={(e) => {
                      inputChangeHandler(e.target.value, "email");
                    }}
                    autoComplete="new-email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    onChange={(e) => {
                      inputChangeHandler(e.target.value, "password");
                    }}
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle caret>
                    {selectedOption || "Select an option"}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => handleDropdownItemClick("Org 1")}
                    >
                      Org 1
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleDropdownItemClick("Org 2")}
                    >
                      Org 2
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </FormGroup>

              <FormGroup>
                {/* <Label for="exampleCheckbox">Inline</Label> */}
                <div>
                  <CustomInput
                    type="checkbox"
                    checked={isLegalDepartment}
                    onChange={(e) => {
                      inputChangeHandler(e.target.value, "isLegalDepartment");
                    }}
                    id="exampleCustomInline"
                    label="Legal Department"
                    inline
                  />
                  <CustomInput
                    type="checkbox"
                    checked={isFinancialDepartment}
                    onChange={(e) => {
                      inputChangeHandler(
                        e.target.value,
                        "isFinantialDepartment"
                      );
                    }}
                    id="exampleCustomInline2"
                    label="Financial Department"
                    inline
                  />
                </div>
              </FormGroup>

              {isSignInFailed ? (
                <div className="text-muted font-italic">
                  <small>
                    {/* password strength:{" "} */}
                    <span className="text-danger font-weight-700">
                      {failedMessage}
                    </span>
                  </small>
                </div>
              ) : (
                ""
              )}
              {/* <div className="text-muted font-italic">
                                <small>
                                    password strength:{" "}
                                    <span className="text-success font-weight-700">strong</span>
                                </small>
                            </div> */}
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                      checked={true}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {isLoading ? (
                      <div className="text-center">
                        <ProgressBar />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button
                  className="mt-4"
                  onClick={() => {
                    createAccount();
                  }}
                  color="primary"
                  type="button"
                >
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
