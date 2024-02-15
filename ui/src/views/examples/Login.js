
import React, { useEffect, useState } from "react";

import {
  Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Row, Col
} from "reactstrap";

import { useHistory } from 'react-router-dom'

import ProgressBar from './ProgressBar'
import axios from 'axios'
import { routes } from '../../helper/config.js'
import { useDispatch, useSelector } from 'react-redux'
import * as UserAction from '../../actions/user'

function Login() {
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.User.isLoading);
  const userData = useSelector((state)=> state?.User?.login?.decodedData)
  let history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginFailed, setIsLoginFailed] = useState(false)
  const [failedMessage, setFailedMessage] = useState('')

  useEffect(() => {
    if(userData && localStorage.getItem('token')){
      history.push('/admin/index')
    }
  }, [])

  const inputChangeHandler = (value, fieldName) => {
    if (fieldName == 'email') {
      setEmail(value)
    } else if (fieldName == 'password') {
      setPassword(value)
    }
  }

  const login = () => {
    let userInfo = {
      email,
      password
    }
    UserAction.startLoading()
    dispatch(UserAction.login(userInfo)).then(()=> {
      UserAction.endLoading();
      history.push('/admin/index')
    }).catch(err => {
      console.log(err)
      alert(err.message)
      UserAction.endLoading();
    })

  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Email" type="email" onChange={e => { inputChangeHandler(e.target.value, 'email') }} autoComplete="new-email" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Password" type="password" onChange={e => inputChangeHandler(e.target.value, 'password')} autoComplete="new-password" />
                </InputGroup>
              </FormGroup>
              {isLoginFailed ?
                <div className="text-center">
                  <p class="text-danger">{failedMessage}</p>
                  
                </div>
                : ""}
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              {isLoading ?
                <div className="text-center">
                  <ProgressBar />
                </div>
                : ""}
              <div className="text-center">
                <Button className="my-4" color="primary" type="button" disabled={!password || !email} onClick={() => { login() }}>
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <small onClick={()=>history.push('/auth/register')}>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
}

export default Login;
