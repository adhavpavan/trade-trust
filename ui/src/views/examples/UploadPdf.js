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
        typeOfPDF,
        onNewClick,
        lotId,
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


    const [pdfToUpload, setPDF] = useState('')
    const [isValidating, setIsValidating] = useState(onNewClick)

    const getFile = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPDF(file);
            };
        }
    };


    const validateAndUploadBill = () => {
        let isInvalid = false

        setIsValidating(true)

        if (pdfToUpload === '') {
            addToast(`Please upload ${typeOfPDF}`, {
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
        setPDF('');
        // setInvoice('');
        setIsValidating(false);
    };


    const uploadBill = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('pdf', pdfToUpload);
        formData.append('lotId', lotId);


        if (pdfToUpload === 'Bill') {
            dispatch(PDFActions.uplodBill(formData)).then(() => {
                addToast(`${typeOfPDF} uploaded successfully`, {
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
        } else if (pdfToUpload === 'Invoice') {

            dispatch(PDFActions.uplodInvoice(formData)).then(() => {
                addToast(`${typeOfPDF} uploaded successfully`, {
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

            dispatch(PDFActions.uplodDeliveryProof(formData)).then(() => {
                addToast(`${typeOfPDF} uploaded successfully`, {
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
            case 'pdfToUpload': setPDF(value); break;

            default:
                break;
        }
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
                <ModalHeader toggle={toggle}>Upload {typeOfPDF}</ModalHeader>
                {isLoading ? <ProgressBar /> :
                    (<>

                        <Card className="bg-secondary  px-md-2">
                            <ModalBody>
                                <Form>

                                    <FormGroup row>
                                        <Label sm={2}>{typeOfPDF}</Label>
                                        <Col sm={9}>

                                            <CustomInput invalid={isValidating && pdfToUpload == ''} type="file" accept=".pdf, .PDF" onChange={e => { getFile(e) }} id="exampleCustomFileBrowser" name="customFile" />

                                            <FormFeedback>*Required</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                        </Card>

                        <ModalFooter>
                            <Button color="primary" onClick={() => { validateAndUploadBill() }}>Submit {typeOfPDF}</Button>{' '}
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