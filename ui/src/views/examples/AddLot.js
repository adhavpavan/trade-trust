import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { useDispatch, useSelector } from 'react-redux';
import * as LotAction from "../../actions/lot";
import Api from 'utils/Api';
import { headers } from 'helper/config';

const AddLot = (props) => {

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
    const [csvFile, setCSV] = useState('')
    const decodedData = useSelector(
        (state) => state?.User?.login?.decodedData
    );


    const fetchOrgList = async () => {
        try {
            setIsLoading(true);
            const response = await Api.get('/v1/organizations/type?size=5&page=1&typeWise=1', headers());
            setOrgList(response.data.payload);

            console.log('---------------orgtypelist------', response.data.payload);
            /**
             * [
    {
        "organizations": [
            {
                "_id": "65e25a79424ae9eefdac5543",
                "name": "Exporter 1"
            }
        ],
        "type": "exporter"
    },
    {
        "organizations": [
            {
                "_id": "65e25a7a424ae9eefdac5547",
                "name": "Bank"
            }
        ],
        "type": "bank"
    },
    {
        "organizations": [
            {
                "_id": "65e25a78424ae9eefdac553f",
                "name": "DTP"
            }
        ],
        "type": "dtp"
    },
    {
        "organizations": [
            {
                "_id": "65e25a7c424ae9eefdac554b",
                "name": "Transporter"
            }
        ],
        "type": "transporter"
    },
    {
        "organizations": [
            {
                "_id": "65e25a7d424ae9eefdac554f",
                "name": "Wholesaler"
            }
        ],
        "type": "wholesaler"
    }
]
             */
            setBanks(response.data.payload.find(x=>x.type==='bank').organizations)
            setShippers(response.data.payload.find(x=>x.type==='transporter').organizations)
            setWholeSalers(response.data.payload.find(x=>x.type==='wholesaler').organizations)
            setIsLoading(false);
        }
        catch (err) {
            console.log(err);
        }
    }


    const userProfileData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    useEffect(() => {

        fetchOrgList();

        console.log("-----banks----", banks);
        console.log("-----shippers----", shippers);
        console.log("-----wholesalers----", wholesalers);



    }, [])

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

        if (selectedShipper === '' || selectedShipper === 'Select') {
            addToast(`Please enter shipper id`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (selectedBank === '' || selectedBank === 'Select') {
            addToast(`Please enter bank id`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (selectedWholeSaler === '' || selectedWholeSaler === 'Select') {
            addToast(`Please enter wholesaler id`, {
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
        formData.append('data', JSON.stringify({ "bankerId": selectedBank, "wholesalerId": selectedWholeSaler, "transporterId": selectedShipper }));

        dispatch(LotAction.uploadCSV(formData)).then(() => {
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
        console.log(value, fieldName)
        switch (fieldName) {
            case 'shipperId': setSelectedShipper(value); break;
            case 'bankId': setSelectedBank(value); break;
            case 'wholesalerId': setSelectedWholeSaler(value); break;
            case 'lotNumber': setLotNumber(value); break;
            case 'csvFile': setCSV(value); break;

            default:
                break;
        }
    }


    const resetInput = () => {
        
        setSelectedBank('');
        setSelectedShipper('');
        setSelectedWholeSaler('');
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
                                                <CustomInput type='select' invalid={isValidating && (selectedShipper === '' || selectedShipper === 'Select')} onChange={e => { inputChangeHandler(e.target.value, 'shipperId') }} placeholder="Shipper Id" >
                                                    <option>Select</option>
                                                    {/*
                                                    <option>786VFH</option>
                                                    <option>809VFG</option>
                                                    <option>432ASD</option> */}
                                                    {
                                                        shippers.map((item) => {
                                                        return <option key={item._id} value={item._id}>{item.name}</option>
                                                        })
                                                    }
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
                                             
                                                <CustomInput type='select' invalid={isValidating && (selectedBank === '' || selectedBank === 'Select')} onChange={e => { inputChangeHandler(e.target.value, 'bankId') }} placeholder="Bank Id" >
                                                    <option>Select</option>
                                                    {/* 
                                                    <option>786VFH</option>
                                                    <option>809VFG</option>
                                                    <option>432ASD</option> */}
                                                    {
                                                        banks.map((item) => {
                                                        return <option key={item._id} value={item._id}>{item.name}</option>
                                                        })
                                                    }
                                                </CustomInput>
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                            {/* </Col> */}
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2} >Wholesaler Id</Label>
                                            <Col sm={10}>
                                                <CustomInput type='select' invalid={isValidating && (selectedWholeSaler === '' || selectedWholeSaler === 'Select')} onChange={e => { inputChangeHandler(e.target.value, 'wholesalerId') }} placeholder="Wholesaler Id" >
                                                    <option>Select</option>
                                                    {/*
                                                    <option>786VFH</option>
                                                    <option>809VFG</option>
                                                    <option>432ASD</option> */}
                                                    {
                                                       wholesalers.map((item) => {
                                                        return <option key={item._id} value={item._id}>{item.name}</option>
                                                        })
                                                    }
                                                </CustomInput>
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                        </FormGroup>

                                        {/* <FormGroup row>
                                            <Label sm={2} >Lot Number</Label>
                                            <Col sm={10}>
                                                <Input invalid={isValidating && lotNumber === ''} onChange={e => { inputChangeHandler(e.target.value, 'lotNumber') }} placeholder="Lot Number" />
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                        </FormGroup> */}
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