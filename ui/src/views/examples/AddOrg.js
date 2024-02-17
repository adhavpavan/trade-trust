import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { getTimeStamp } from '../../helper/utils'
import { useDispatch, useSelector } from 'react-redux';

import * as Organization from '../../actions/organization'
const AddOrg = (props) => {
    const {
        className,
        modal,
        toggle
    } = props;

    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.Organization.isLoading);

    const decodedData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    useEffect(() => {
        console.log("-----------------qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq----------------------", decodedData)

    }, [decodedData])


    const [orgType, setOrgType] = useState('')
    const [orgName, setOrgName] = useState('')
    const [isValidating, setIsValidating] = useState(false)

    const validateAndAddOrg = () => {
        let isInvalid = false

        setIsValidating(true)

        if (orgType == '') {
            addToast(`Please add organization type`, {
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
            addOrg();
        }

    }


    const resetInput = () => {
        setOrgType('');
        setOrgName('');
    };


    const addOrg = () => {
        console.log("Here****************");

        const data = new FormData()
        data.append('name', orgName)

        dispatch(Organization.addORG(data)).then(() => {
            addToast(`Organization created successfully`, {
                appearance: 'success',
                autoDismiss: true,
            });
            toggle();
        }).catch((error) => {
            alert(error)
        }).finally(() => {
            resetInput()
            setIsValidating(false)
        })
    }


    const inputChangeHandler = (value, fieldName) => {
        switch (fieldName) {
            case 'orgType': setOrgType(value); break;
            case 'orgName': setOrgName(value); break;

            default:
                break;
        }
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
                <ModalHeader toggle={toggle}>Add Organization Details</ModalHeader>
                {isLoading ? <ProgressBar /> :
                    (<>

                        <Card className="bg-secondary  px-md-2">
                            <ModalBody>
                                <FormGroup row>
                                    <Label sm={2}>Organization Name</Label>
                                    <Col sm={10}>
                                        <Input type="text" invalid={isValidating && orgName == ''} onChange={e => { inputChangeHandler(e.target.value, 'orgName') }} placeholder="Enter Organization Name" />
                                        <FormFeedback>*Required</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <Form>

                                    <FormGroup row>
                                        <Label sm={2}>Organization Type</Label>
                                        <Col sm={10}>
                                            <Input invalid={isValidating && orgType == ''} onChange={e => { inputChangeHandler(e.target.value, 'orgType') }} placeholder="Enter Organization Type" />
                                            <FormFeedback>*Required</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                        </Card>

                        <ModalFooter>
                            <Button color="primary" onClick={(e) => {
                                e.preventDefault();
                                console.log("Here**************");
                                validateAndAddOrg();
                            }}>Submit Organization</Button>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </>)
                }
            </Modal>
        </div>
    );
}
export default AddOrg;