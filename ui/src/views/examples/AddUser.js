import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { getTimeStamp } from '../../helper/utils'
import { useSelector } from 'react-redux';

const AddUser = (props) => {
    const {
        className,
        modal,
        toggle
    } = props;

    const { addToast } = useToasts();
    // const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.Agreement.isLoading);

    // const decodedData = useSelector(
    //     (state) => state?.User?.login?.decodedData
    // );

    // useEffect(() => {
    //     console.log("-----------------qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq----------------------", decodedData)

    // }, [decodedData])


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [orgName, setOrgName] = useState('')
    const [isValidating, setIsValidating] = useState(false)

    const validateAndAddContract = () => {
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
        if (orgName == '') {
            addToast(`Please add organisiton name`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }

        if (!isInvalid) {
            addUser()
        }

    }


    const resetInput = () => {
        setEmail('');
        setName('');
        setOrgName('');
    };


    const addUser = () => {

    }


    const inputChangeHandler = (value, fieldName) => {
        switch (fieldName) {
            case 'email': setEmail(value); break;
            case 'name': setName(value); break;
            case 'orgName': setOrgName(value); break;

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
                                        <Label sm={2}>Organization Name</Label>
                                        <Col sm={10}>
                                            <Input invalid={isValidating && orgName == ''} onChange={e => { inputChangeHandler(e.target.value, 'orgName') }} placeholder="Enter Organization name" />
                                            <FormFeedback>*Required</FormFeedback>
                                        </Col>
                                    </FormGroup>

                                </Form>
                            </ModalBody>
                        </Card>

                        <ModalFooter>
                            <Button color="primary" onClick={() => { validateAndAddContract() }}>Submit User</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </>)
                }
            </Modal>
        </div>
    );
}
export default AddUser;