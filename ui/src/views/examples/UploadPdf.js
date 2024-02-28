import React, { useState } from 'react';
import Header from "../../components/Headers/Header";
import PropTypes from 'prop-types';
import { useToasts } from 'react-toast-notifications'
import {
    Badge,
    Card,
    CardHeader,
    Form,
    Input,
    FormGroup,
    FormFeedback,
    Label,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Container,
    Spinner,
    Row,
    UncontrolledTooltip,
    Button,
    Col,
    CardBody,
} from "reactstrap";


const UploadPdfComponent = () => {
    const [shipperId, setShipperId] = useState('')
    const [bankId, setBankId] = useState('')
    const [wholeSellerId, setWholeSellerId] = useState('')
    const [lotNumber, setLotNumber] = useState('')
    const [pdfFile, setPdfFile] = useState('')
    const [isValidating, setIsValidating] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const { addToast } = useToasts();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        inputChangeHandler(event.target.value, 'pdfFile');
    };
    const validateAndAddOrg = () => {
        let isInvalid = false

        setIsValidating(true)

        if (shipperId == '') {
            addToast(`Please enter shipper id`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (bankId == '') {
            addToast(`Please enter bank id`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (wholeSellerId == '') {
            addToast(`Please enter wholeSeller id`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (lotNumber == '') {
            addToast(`Please enter lot number`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (pdfFile == '') {
            addToast(`Please enter pdf file`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }

        if (!isInvalid) {
            handleUpload();
        }

    }
    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        // axios.post('/upload', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // }).then(response => {
        //     console.log('File uploaded successfully');
        // }).catch(error => {
        //     console.error('Error uploading file:', error);
        // });
    };

    const inputChangeHandler = (value, fieldName) => {
        switch (fieldName) {
            case 'shipperId': setShipperId(value); break;
            case 'bankId': setBankId(value); break;
            case 'wholeSellerId': setWholeSellerId(value); break;
            case 'lotNumber': setLotNumber(value); break;
            case 'pdfFile': setPdfFile(value); break;

            default:
                break;
        }
    }
    return (
        <div>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Col sm={9}>
                                    <h3 className="mb-0">Upload PDF</h3>
                                </Col>
                            </CardHeader>
                            <center>

                            </center>
                            <Card body>
                                <Form>
                                    <center>
                                        <FormGroup col>
                                            <Row>
                                                <Col>
                                                    <Label sm={16}>Shipper Id</Label>
                                                    <Col sm={10}>
                                                        <Input invalid={isValidating && shipperId == ''} onChange={e => { inputChangeHandler(e.target.value, 'shipperId') }} placeholder="Shipper Id" />
                                                        <FormFeedback>*Required</FormFeedback>
                                                    </Col>
                                                </Col>
                                                <Col>
                                                    <Label sm={16}>Bank Id</Label>
                                                    <Col sm={10}>
                                                        <Input invalid={isValidating && bankId == ''} onChange={e => { inputChangeHandler(e.target.value, 'bankId') }} placeholder="Bank Id" />
                                                        <FormFeedback>*Required</FormFeedback>
                                                    </Col>
                                                </Col>
                                            </Row>
                                            <br />
                                            <Row>
                                                <Col>
                                                    <Label sm={16}>WholeSeller Id</Label>
                                                    <Col sm={10}>
                                                        <Input invalid={isValidating && wholeSellerId == ''} onChange={e => { inputChangeHandler(e.target.value, 'wholeSellerId') }} placeholder="WholeSeller Id" />
                                                        <FormFeedback>*Required</FormFeedback>
                                                    </Col>
                                                </Col>
                                                <Col>
                                                    <Label sm={16}>Lot Number</Label>
                                                    <Col sm={10}>
                                                        <Input invalid={isValidating && lotNumber == ''} onChange={e => { inputChangeHandler(e.target.value, 'lotNumber') }} placeholder="Lot Number" />
                                                        <FormFeedback>*Required</FormFeedback>
                                                    </Col>
                                                </Col>
                                            </Row>
                                            <br />
                                            <br />
                                            <Row>
                                                <Col>
                                                    {/* <Label sm={16}>Select PDF</Label> */}
                                                    <Col sm={11}>
                                                        <Input type='file' invalid={isValidating && pdfFile == ''} onChange={e => {
                                                            e.preventDefault();
                                                            handleFileChange(e);
                                                        }} />
                                                        <FormFeedback>*Required</FormFeedback>
                                                    </Col>
                                                    <Col sm={16}>
                                                        <Button className="my-1" color="primary" onClick={() => { validateAndAddOrg() }} type="button">{"Upload"}</Button>
                                                    </Col>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    </center>

                                </Form>

                            </Card>
                        </Card>
                    </div>
                </Row>
            </Container>
        </div>
    );
};

UploadPdfComponent.propTypes = {

};

export default UploadPdfComponent;