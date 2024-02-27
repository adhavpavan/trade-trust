import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { getTimeStamp } from '../../helper/utils'
import { useDispatch, useSelector } from 'react-redux';

import * as PDFActions from '../../actions/uploadPDF';
const UploadPDF = (props) => {
    const {
        className,
        modal,
        toggle,
        isBill,
        onNewClick,
    } = props;

    const { addToast } = useToasts();
    const dispatch = useDispatch();
    // const isLoading = useSelector((state) => state.PDFData.isLoading);
    const [isLoading, setLoading] = useState(false);
    const decodedData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    useEffect(() => {
        console.log("-----------------qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq----------------------", decodedData)
    }, [decodedData])


    const [name, setName] = useState('')
    const [bill, setBill] = useState('')
    const [invoice, setInvoice] = useState('')
    const [isValidating, setIsValidating] = useState(onNewClick)

    const getFile = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                isBill ? setBill(file) : setInvoice(file);
            };
        }
    };


    const validateAndUploadBill = () => {
        let isInvalid = false

        setIsValidating(true)

        if (name === '') {
            addToast(`Please name`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (isBill && bill === '') {
            addToast(`Please upload bill`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (!isBill && invoice === '') {
            addToast(`Please upload invoice`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        console.log(isValidating);
        if (!isInvalid) {
            uploadBill();
        }

    }


    const resetInput = () => {
        setName('');
        setBill('');
        setInvoice('');
        setIsValidating(false);
    };


    const uploadBill = () => {
        console.log("Here****************");

        // const data = new FormData()
        // data.append('name', orgName)

        setLoading(true);
        const formData = new FormData();
        if (bill !== '') {
            formData.append('pdf', bill);
        } else {
            formData.append('pdf', invoice);
        }

        if (isBill) {
            dispatch(PDFActions.uplodBill(formData)).then(() => {
                addToast(`Bill uploaded successfully`, {
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
        } else {

            dispatch(PDFActions.uplodInvoice(formData)).then(() => {
                addToast(`Invoice uploaded successfully`, {
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
        setLoading(false);
    }


    const inputChangeHandler = (value, fieldName) => {
        switch (fieldName) {
            case 'name': setName(value); break;
            case 'bill': setBill(value); break;
            case 'invoice': setInvoice(value); break;

            default:
                break;
        }
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
                <ModalHeader toggle={toggle}>{isBill ? 'Upload Bill' : 'Upload Invoice'}</ModalHeader>
                {isLoading ? <ProgressBar /> :
                    (<>

                        <Card className="bg-secondary  px-md-2">
                            <ModalBody>
                                <FormGroup row>
                                    <Label sm={2}>Name</Label>
                                    <Col sm={10}>
                                        <Input type="text" invalid={isValidating && name == ''} onChange={e => { inputChangeHandler(e.target.value, 'name') }} placeholder="Enter name" />
                                        <FormFeedback>*Required</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <Form>
                                    {/* <FormGroup> */}
                                    {/* <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
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
              </FormGroup> */}

                                    <FormGroup row>
                                        {
                                            isBill ? <>
                                                <Label sm={2}>Bill</Label>
                                            </> : <>
                                                <Label sm={2}>Invoice</Label>
                                            </>
                                        }
                                        <Col sm={9}>
                                            {
                                                isBill ?
                                                    <>
                                                        <CustomInput invalid={isValidating && bill == ''} type="file" accept=".pdf, .PDF" onChange={e => { getFile(e) }} id="exampleCustomFileBrowser" name="customFile" />
                                                    </> :
                                                    <>
                                                        <CustomInput invalid={isValidating && invoice == ''} type="file" accept=".pdf, .PDF" onChange={e => { getFile(e) }} id="exampleCustomFileBrowser" name="customFile" />
                                                    </>
                                            }
                                            <FormFeedback>*Required</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                        </Card>

                        <ModalFooter>
                            <Button color="primary" onClick={() => { validateAndUploadBill() }}>Submit {isBill ? 'Bill' : 'Invoice'}</Button>{' '}
                            <Button color="secondary" onClick={() => {
                                resetInput();
                                toggle();
                            }}>Cancel</Button>
                        </ModalFooter>
                    </>)
                }
            </Modal>
        </div>
    );
}
export default UploadPDF;