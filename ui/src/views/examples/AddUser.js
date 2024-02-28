import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { getTimeStamp } from '../../helper/utils'
import { useSelector, useDispatch } from 'react-redux';
import * as UserAction from "../../actions/user";


const AddUser = (props) => {
    const {
        className,
        modal,
        toggle,
        isReset
    } = props;

    const { addToast } = useToasts();
    const isLoading = useSelector((state) => state.Agreement.isLoading);


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [department, setDepartment] = useState('financial')
    const [password, setPassword] = useState('')
    const [isValidating, setIsValidating] = useState(isReset)
    const dispatch = useDispatch();
    const userProfileData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    const validateAndAddUser = () => {
        let isInvalid = false

        setIsValidating(true)

        if (name == '') {
            addToast(`Please add user name`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (email == '') {
            addToast(`Please add user email`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (department == '') {
            addToast(`Please add organization type`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (password == '') {
            addToast(`Please enter password`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }

        if (!isInvalid) {
            addUser();
        }

    }


    const resetInput = () => {
        setEmail('');
        setName('');
        setPassword('');
        setDepartment('')
    };


    const addUser = async () => {
        setIsValidating(true)
        const data = {
            'name': name,
            'email': email,
            'password': password,
            'department': department,
            'orgId': userProfileData?.orgId
        }
        dispatch(UserAction.addUser(data)).then(() => {
            addToast(`User created successfully`, {
                appearance: 'success',
                autoDismiss: true,
            });
            toggle();
        }).catch((error) => {
            alert(error)
        }).finally(() => {
            resetInput()
            setIsValidating(false)
        });
    };


    const inputChangeHandler = (value, fieldName) => {
        switch (fieldName) {
            case 'email': setEmail(value); break;
            case 'department': setDepartment(value); break;
            case 'name': setName(value); break;
            case 'password': setPassword(value); break;

            default:
                break;
        }
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
                <ModalHeader toggle={toggle}>Add User Details</ModalHeader>
                {isLoading ? <ProgressBar /> :
                    (<>

                        <Card className="bg-secondary  px-md-2">
                            <ModalBody>
                                <FormGroup row>
                                    <Label sm={2}>Name</Label>
                                    <Col sm={10}>
                                        <Input type="text" invalid={isValidating && name == ''} onChange={e => { inputChangeHandler(e.target.value, 'name') }} placeholder="Enter Name" />
                                        <FormFeedback>*Required</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <Form>
                                    <FormGroup row>
                                        <Label sm={2}>Email</Label>
                                        <Col sm={10}>
                                            <Input invalid={isValidating && email == ''} onChange={e => { inputChangeHandler(e.target.value, 'email') }} placeholder="Enter User Email" />
                                            <FormFeedback>*Required</FormFeedback>
                                        </Col>
                                    </FormGroup>
                               
                                    <FormGroup row>
                                        <Label sm={2}>Department</Label>
                                        <Col sm={10}>
                                            <CustomInput type='select' invalid={isValidating && department == ''} onChange={e => { inputChangeHandler(e.target.value, 'department') }} >
                                                <option value={'financial'}>Financial</option>
                                                <option value={'legal'}>Legal</option>
                                            </CustomInput>
                                            <FormFeedback>*Required</FormFeedback>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Label sm={2}>Password</Label>
                                        <Col sm={10}>

                                            <Input type="password" invalid={isValidating && password == ''} onChange={e => inputChangeHandler(e.target.value, 'password')} placeholder="Enter Password" />
                                            {/* <Input invalid={isValidating && orgName == ''} onChange={e => { inputChangeHandler(e.target.value, 'orgName') }} placeholder="Enter Organization name" /> */}
                                            <FormFeedback>*Required</FormFeedback>
                                        </Col>
                                    </FormGroup>

                                </Form>
                            </ModalBody>
                        </Card>

                        <ModalFooter>
                            <Button color="primary" onClick={() => { validateAndAddUser() }}>Submit User</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </>)
                }
            </Modal>
        </div>
    );
}
export default AddUser;