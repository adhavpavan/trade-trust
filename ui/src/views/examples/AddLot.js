import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { useDispatch, useSelector } from 'react-redux';
import * as LotAction from "../../actions/lot";

const AddLot = (props) => {
    const {
        className,
        modal,
        toggle
    } = props;

    const { addToast } = useToasts();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [shipperId, setShipperId] = useState('')
    const [bankId, setBankId] = useState('')
    const [wholeSellerId, setWholeSellerId] = useState('')
    const [lotNumber, setLotNumber] = useState('')
    const [vendor, setVendor] = useState('')
    const [csvFile, setCSV] = useState('')
    const decodedData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    const userProfileData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    useEffect(() => {
        console.log("-----------------qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq----------------------", decodedData)
    }, [decodedData])
    const getFile = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setCSV(file);
            };
        }
    };


    const [isValidating, setIsValidating] = useState(false)
    const validateAndAddOrg = () => {
        let isInvalid = false
        setIsValidating(true)

        if (shipperId === '' || shipperId === 'Select') {
            addToast(`Please enter shipper id`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (bankId === '' || bankId === 'Select') {
            addToast(`Please enter bank id`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (wholeSellerId === '' || wholeSellerId === 'Select') {
            addToast(`Please enter wholeSeller id`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (lotNumber === '') {
            addToast(`Please enter lot number`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (csvFile === '') {
            addToast(`Please enter pdf file`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }

        if (!isInvalid) {
            console.log("0000000000000011111111111111111111");
            handleUpload();
        }
    }


    const handleUpload = () => {
        setIsLoading(true);
        LotAction.startLoading();
        const formData = new FormData();
        formData.append('xls', csvFile);
        formData.append('data', JSON.stringify({ "bankerId": bankId, "wholesellerid": wholeSellerId, "transporterId": userProfileData?.orgId }));

        dispatch(LotAction.uplodCSV(formData)).then(() => {
            addToast(`Lot created successfully`, {
                appearance: 'success',
                autoDismiss: true,
            });
            // toggle();
        }).catch((error) => {
            alert(error)
        }).finally(() => {
            // resetInput()
            setIsValidating(false);
            resetInput();
            toggle();
        })
        LotAction.endLoading();
        setIsLoading(false);
    };

    const inputChangeHandler = (value, fieldName) => {
        switch (fieldName) {
            case 'shipperId': setShipperId(value); break;
            case 'bankId': setBankId(value); break;
            case 'wholeSellerId': setWholeSellerId(value); break;
            case 'lotNumber': setLotNumber(value); break;
            case 'csvFile': setCSV(value); break;

            default:
                break;
        }
    }


    const resetInput = () => {
        setShipperId('');
        setBankId('');
        setWholeSellerId('');
        setLotNumber('');
        setCSV('');
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
                <ModalHeader toggle={toggle}>Create Lot</ModalHeader>
                {isLoading ? <ProgressBar /> :
                    (<>

                        <Card className="bg-secondary  px-md-2">
                            <ModalBody>
                                <Form>
                                    <Col>
                                        <FormGroup row>
                                            {/* <Row> */}
                                            {/* <Col> */}
                                            <Label sm={2}>Shipper Id</Label>
                                            <Col sm={10}>
                                                <CustomInput type='select' invalid={isValidating && (shipperId === '' || shipperId === 'Select')} onChange={e => { inputChangeHandler(e.target.value, 'shipperId') }} placeholder="Shipper Id" >
                                                    <option>Select</option>
                                                    <option>786VFH</option>
                                                    <option>809VFG</option>
                                                    <option>432ASD</option>
                                                </CustomInput>
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                            {/* </Col> */}
                                            {/* </Row> */}
                                        </FormGroup>

                                        <FormGroup row>

                                            {/* <Col> */}
                                            <Label sm={2}>Bank Id</Label>
                                            <Col sm={10}>
                                                <CustomInput type='select' invalid={isValidating && (bankId === '' || bankId === 'Select')} onChange={e => { inputChangeHandler(e.target.value, 'bankId') }} placeholder="Bank Id" >
                                                    <option>Select</option>
                                                    <option>786VFH</option>
                                                    <option>809VFG</option>
                                                    <option>432ASD</option>
                                                </CustomInput>
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                            {/* </Col> */}
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2} >WholeSeller Id</Label>
                                            <Col sm={10}>
                                                <CustomInput type='select' invalid={isValidating && (wholeSellerId === '' || wholeSellerId === 'Select')} onChange={e => { inputChangeHandler(e.target.value, 'wholeSellerId') }} placeholder="WholeSeller Id" >
                                                    <option>Select</option>
                                                    <option>786VFH</option>
                                                    <option>809VFG</option>
                                                    <option>432ASD</option>
                                                </CustomInput>
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                        </FormGroup>

                                        <FormGroup row>
                                            <Label sm={2} >Lot Number</Label>
                                            <Col sm={10}>
                                                <Input invalid={isValidating && lotNumber === ''} onChange={e => { inputChangeHandler(e.target.value, 'lotNumber') }} placeholder="Lot Number" />
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>

                                            <Label sm={2}>Select Excel</Label>
                                            <Col sm={10}>

                                                <CustomInput placeholder='Choose CSV' invalid={isValidating && csvFile === ''} type="file" accept=".csv, .xlsm, .xlsx, .xlsm" onChange={e => { getFile(e) }} id="exampleCustomFileBrowser" name="customFile" />
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>

                                        </FormGroup>
                                    </Col>
                                </Form>
                            </ModalBody>
                        </Card>

                        <ModalFooter>
                            {
                                isLoading ? <></> : <Button className="my-1" color="primary" onClick={(e) => {
                                    e.preventDefault();
                                    validateAndAddOrg();
                                }} type="button">{"Upload"}</Button>
                            }

                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </>)
                }
            </Modal>
        </div>
    );
}
export default AddLot;