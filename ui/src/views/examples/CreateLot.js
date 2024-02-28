import React, { useEffect, useState } from 'react';
import Header from "../../components/Headers/Header";
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from "react-redux";
import * as OrgActions from "../../actions/organization";
import * as LotAction from "../../actions/lot";
import {
    Card,
    CardHeader,
    Form,
    Input,
    Dropdown,
    FormGroup,
    FormFeedback,
    Label,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Container,
    Row,
    Button,
    Col,
    CustomInput,
} from "reactstrap";


const CreateLot = () => {
    const [shipperId, setShipperId] = useState('')
    const [bankId, setBankId] = useState('')
    const [wholeSellerId, setWholeSellerId] = useState('')
    const [lotNumber, setLotNumber] = useState('')
    const [vendor, setVendor] = useState('')
    const [deadline, setDeadline] = useState('')
    const [orderingDate, setOrderingDate] = useState('')
    const [agreementType, setAgreementType] = useState('')
    const [product, setProduct] = useState('')
    const [qty, setQty] = useState('')
    const [price, setPrice] = useState('')
    const [confirmQty, setConfirmQty] = useState('')
    const [tax, setTax] = useState('')
    const [unitOfMeasure, setUnitOfMeasure] = useState('')
    const [csvFile, setCSV] = useState('')
    const [isValidating, setIsValidating] = useState(false)
    // const [selectedFile, setSelectedFile] = useState(null);
    const { addToast } = useToasts();
    // const orgListData = useSelector((state) => state.Organization.orgList.docs);

    const orgList = useSelector((state) => state.Organization.orgList.docs);
    const [orgSelected, setOrgSelected] = useState('');
    const [paginationData, setPaginationData] = useState({ selectedPage: 0 });
    const dispatch = useDispatch();
    const userProfileData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    const [dropdownOpen, setDropdownOpen] = useState(false);
    // const [items, setItems] = useState([]);

    // useEffect(() => {
    //     // Fetch data from API
    //     axios.get('your-api-endpoint')
    //         .then(response => {
    //             // Assuming the API response is an array of items
    //             setItems(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, []);


    // useEffect(() => {
    //     console.log(`-------------------------------`);

    //     const fetchData = async () => {
    //         try {
    //             // const response = 
    //             var response = await dispatch(OrgActions.getORGList({
    //                 page: 0,
    //                 size: 10,
    //             }));
    //             console.log("response from org list", response);
    //             // setOrgListData(response);
    //             // Update state with fetched data
    //         } catch (error) {
    //             console.error('Error fetching organization data:', error);
    //         }
    //     };

    //     fetchData(); // Fetch data when component mounts

    // }, []);

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };
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


    // useEffect(() => {
    //     console.log("pagination data changed", paginationData);

    //     dispatch(OrgActions.getORGList({
    //         page: 0,
    //         size: 10,
    //     }));
    // }, [paginationData]);
    // const handleFileChange = (event) => {
    //     setSelectedFile(event.target.files[0]);
    //     inputChangeHandler(event.target.value, 'csvFile');
    // };
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

    const validateAndCreateLot = () => {
        let isInvalid = false

        setIsValidating(true)

        if (vendor === '') {
            addToast(`Please vendor`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (bankId === '') {
            addToast(`Please enter bank id`, {
                appearance: 'error',
                autoDismiss: true,
            })
            isInvalid = true
        }
        if (wholeSellerId === '') {
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
            createLot();
        }
    }

    const createLot = () => {

    }

    const handleUpload = () => {
        LotAction.startLoading();
        const formData = new FormData();
        formData.append('xls', csvFile);
        formData.append('data', JSON.stringify({ "bankerId": bankId, "wholesellerid": wholeSellerId, "transporterId": userProfileData?.orgId }));


        // axios.post('/upload', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // }).then(response => {
        //     console.log('File uploaded successfully');
        // }).catch(error => {
        //     console.error('Error uploading file:', error);
        // });

        dispatch(LotAction.uplodCSV(formData)).then(() => {
            addToast(`CSV uploaded successfully`, {
                appearance: 'success',
                autoDismiss: true,
            });
            // toggle();
        }).catch((error) => {
            alert(error)
        }).finally(() => {

            // resetInput()
            setIsValidating(false);
        })
        LotAction.endLoading();
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
    const handleItemClick = (item) => {
        setOrgSelected(item.name);
        console.log('Selected item:', item);
        // Do something with the selected item, such as updating state or making another API call
    };

    return (
        <div>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Col sm={9}>
                                    <h3 className="mb-0">Create Lot</h3>
                                </Col>
                            </CardHeader>
                            <Card body>
                                {/* {orgList.length !== 0 ? <> */}
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
                                                {/* <Input type='file' name='file' id='fileid' accept=".xlsm, .xls, .xlsx" invalid={isValidating && csvFile === ''} onChange={e => {
                                                                    e.preventDefault();
                                                                    handleFileChange(e);
                                                                }} > */}
                                                {/* </Input> */}
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>

                                        </FormGroup>

                                        {/* <FormGroup row>
                                                <Label sm={2}>Organization Name</Label>
                                                <Col sm={10}>
                                                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                                        <DropdownToggle caret>
                                                            {orgSelected === '' ? 'Select Item' : orgSelected}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            {orgList.map(item => (
                                                                <DropdownItem key={item.id} onClick={() => handleItemClick(item)}>
                                                                    {item.name} 
                                                                </DropdownItem>
                                                            ))}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </Col>
                                            </FormGroup> */}
                                        {/* {csvFile !== '' ? <> */}
                                        {/* <FormGroup row>

                                            <Label sm={2} >Vendor</Label>
                                            <Col sm={10}>
                                                <Input invalid={isValidating && vendor === ''} onChange={e => { inputChangeHandler(e.target.value, 'vendor') }} placeholder="Vandor" />
                                                <FormFeedback>*Required</FormFeedback>
                                            </Col>
                                        </FormGroup>
                                            <FormGroup row>

                                                <Label sm={2} >Deadline</Label>
                                                <Col sm={10}>
                                                    <Input invalid={isValidating && deadline === ''} onChange={e => { inputChangeHandler(e.target.value, 'deadline') }} placeholder="Deadline" />
                                                    <FormFeedback>*Required</FormFeedback>
                                                </Col>

                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Ordering Date</Label>
                                                <Col sm={10}>
                                                    <Input invalid={isValidating && orderingDate === ''} onChange={e => { inputChangeHandler(e.target.value, 'orderingDate') }} placeholder="Ordering Date" />
                                                    <FormFeedback>*Required</FormFeedback>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>

                                                <Label sm={2} >Agreement Type</Label>
                                                <Col sm={10}>
                                                    <Input invalid={isValidating && agreementType === ''} onChange={e => { inputChangeHandler(e.target.value, 'agreementType') }} placeholder="Agreement Type" />
                                                    <FormFeedback>*Required</FormFeedback>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>

                                                <Label sm={2} >Product</Label>
                                                <Col sm={10}>
                                                    <Input invalid={isValidating && product === ''} onChange={e => { inputChangeHandler(e.target.value, 'product') }} placeholder="Product" />
                                                    <FormFeedback>*Required</FormFeedback>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Quantity</Label>
                                                <Col sm={10}>
                                                    <Input invalid={isValidating && qty === ''} onChange={e => { inputChangeHandler(e.target.value, 'qty') }} placeholder="Quantity" />
                                                    <FormFeedback>*Required</FormFeedback>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>

                                                <Label sm={2} >Price</Label>
                                                <Col sm={10}>
                                                    <Input invalid={isValidating && price === ''} onChange={e => { inputChangeHandler(e.target.value, 'price') }} placeholder="Price" />
                                                    <FormFeedback>*Required</FormFeedback>
                                                </Col>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label sm={2} >Confirm Quantity</Label>
                                                <Col sm={10}>
                                                    <Input invalid={isValidating && confirmQty === ''} onChange={e => { inputChangeHandler(e.target.value, 'confirmQty') }} placeholder="Confirm Quantity" />
                                                    <FormFeedback>*Required</FormFeedback>

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>

                                                <Label sm={2} >Tax</Label>
                                                <Col sm={10}>
                                                    <Input invalid={isValidating && tax === ''} onChange={e => { inputChangeHandler(e.target.value, 'tax') }} placeholder="Tax" />
                                                    <FormFeedback>*Required</FormFeedback>
                                                </Col>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label sm={2} >Unit Of Measure</Label>
                                                <Col sm={10}>
                                                    <Input invalid={isValidating && unitOfMeasure === ''} onChange={e => { inputChangeHandler(e.target.value, 'unitOfMeasure') }} placeholder="Unit Of Measure" />
                                                    <FormFeedback>*Required</FormFeedback>
                                                </Col>

                                            </FormGroup>
                                            <FormGroup row>
                                                <Col sm={10}>
                                                    <Button className="my-1" color="primary" onClick={() => { validateAndCreateLot() }} type="button">{"Create Lot"}</Button>
                                                </Col>

                                            </FormGroup> */}
                                        {/* </> : <> */}
                                        <FormGroup row>
                                            <Col sm={10}>
                                                <Button className="my-1" color="primary" onClick={() => { validateAndAddOrg() }} type="button">{"Upload"}</Button>
                                            </Col>

                                        </FormGroup>
                                        {/* </>} */}
                                    </Col>
                                </Form>
                                {/* </>
                                    : <>Loading</>} */}
                            </Card>
                        </Card>
                    </div>
                </Row >
            </Container >
        </div >
    );
};

CreateLot.propTypes = {

};

export default CreateLot;