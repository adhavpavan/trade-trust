import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { useDispatch, useSelector } from 'react-redux';
import * as LotAction from "../../actions/lot";
import Api from 'utils/Api';
import { headers } from 'helper/config';

const VerifyDocument = (props) => {

    // {{HOST}}/organizations/type?size=5&page=1&typeWise=1







    const {
        className,
        modal,
        toggle
    } = props;

    const { addToast } = useToasts();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [orgList, setOrgList] = useState([])
    const [shippers, setShippers] = useState([{ id: '', name: '' }]);
    const [banks, setBanks] = useState([{ id: '', name: '' }]);
    const [wholesalers, setWholeSalers] = useState([{ id: '', name: '' }]);
    const [selectedShipper, setSelectedShipper] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedWholeSaler, setSelectedWholeSaler] = useState('');
    const [lotNumber, setLotNumber] = useState('')
    const [vendor, setVendor] = useState('')
    const [id, setId] = useState('')
    const [csvFile, setCSV] = useState('')
    const decodedData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    const [isVerified, setIsVerified] = useState(false)



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

        if (id === '') {
            addToast(`Please enter id`, {
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


    const handleUpload = async () => {
        let res
        try {


            setIsLoading(true);
            LotAction.startLoading();
            const formData = new FormData();
            formData.append('pdf', csvFile);

             res = await Api.post(`/v1/pdf/verify_eBill/` + id, formData, headers())

            if (res.data.status === 200) {

                console.log("res", res.data);
                const result = res.data.payload;
                setIsVerified(result?.verified);
                setIsLoading(false);
            }
        }
        catch (err) {
            console.log("err", err);
            //if 400 then
            if (err.response.data.code === 400) {
                addToast("not verified", {
                    appearance: 'error',
                    autoDismiss: true,
                })
                setIsLoading(false);
                // LotAction.stopLoading();
                return;
            }
        }

    };

    const inputChangeHandler = (value, fieldName) => {
        console.log(value, fieldName)
        switch (fieldName) {

            case 'id': setId(value); break;
            case 'csvFile': setCSV(value); break;

            default:
                break;
        }
    }


    const resetInput = () => {

        setId('');
        setCSV('');
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
                <ModalHeader toggle={toggle}></ModalHeader>
                {isLoading ? <ProgressBar /> :
                    (<>

                        <Card className="bg-secondary  px-md-2">
                            <ModalBody>
                                <Form>
                                    <Col>
                                        <FormGroup row>
                                            {/* <Row> */}
                                            {/* <Col> */}
                                            <Label sm={2}> Id</Label>
                                            <Col sm={10}>
                                                <CustomInput type='text'
                                                    invalid={isValidating && (id === '')}
                                                    onChange={e => { inputChangeHandler(e.target.value, 'id') }} />
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                            {/* </Col> */}
                                            {/* </Row> */}
                                        </FormGroup>
                                        <FormGroup row>

                                            <Label sm={2}>Select Document</Label>
                                            <Col sm={10}>

                                                <CustomInput placeholder='Choose' invalid={isValidating && csvFile === ''} type="file" accept=".pdf" onChange={e => { getFile(e) }} id="exampleCustomFileBrowser" name="customFile" />
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                            <p>
                                                {
                                                    isVerified ?
                                                        <span className="text-success">Verified</span>
                                                        :
                                                        <span className="text-danger"></span>
                                                }
                                            </p>
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
export default VerifyDocument;