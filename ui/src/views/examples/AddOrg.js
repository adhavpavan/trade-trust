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


    const [orgType, setOrgType] = useState('transporter')
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
            addToast(`Please add organization name`, {
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
        setOrgType('transporter');
        setOrgName('');
    };


    const addOrg = () => {

        const data = {
            name: orgName,
            type: orgType,
            parentId: decodedData?.orgId,
        }

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
            case 'type': setOrgType(value); break;
            case 'name': setOrgName(value); break;

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
                                        <Input type="text" invalid={isValidating && orgName == ''} onChange={e => { inputChangeHandler(e.target.value, 'name') }} placeholder="Enter Organization Name" />
                                        <FormFeedback>*Required</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <Form>

                                    <FormGroup row>
                                        <Label sm={2}>Organization Type</Label>
                                        <Col sm={10}>
                                            <CustomInput type='select' invalid={isValidating && orgType == ''} onChange={e => { inputChangeHandler(e.target.value, 'type') }} >
                                                <option value={'transporter'}>Transporter</option>
                                                <option value={'banker'}>Banker</option>
                                                <option value={'exporter'}>Exporter</option>
                                                <option value={'DTP'}>DTP</option>
                                                <option value={'wholseller'}>Wholseller</option>
                                            </CustomInput>
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