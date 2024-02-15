
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { getTimeStamp } from '../../helper/utils'

import { useDispatch, useSelector } from 'react-redux';
import * as AgreementAction from '../../actions/agreement';

const AddContract = (props) => {
  const {
    className,
    modal,
    toggle
  } = props;

  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.Agreement.isLoading);

  const decodedData = useSelector(
    (state) => state?.User?.login?.decodedData
  );

  useEffect(() => {
    console.log("-----------------qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq----------------------", decodedData)
  
  }, [decodedData])
  



  const [title, setTitle] = useState('')
  const [typeOfContract, setTypeOfContract] = useState('')
  const [startDate, setStartDate] = useState('')
  const [contractDetails, setContractDetails] = useState('')
  const [endDate, setEndDate] = useState('')
  const [firstParty, setFirstParty] = useState('')
  const [secondParty, setSecondParty] = useState('')
  const [document, setDocument] = useState('')
  const [comment, setComment] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  // const [dropdownOpen1, setDropdownOpen1] = useState(false);
  // const [selectedOption1, setSelectedOption1] = useState(null);
  // const toggle1 = () => setDropdownOpen1((prevState) => !prevState);

  // const [dropdownOpen2, setDropdownOpen2] = useState(false);
  // const [selectedOption2, setSelectedOption2] = useState(null);
  // const toggle2 = () => setDropdownOpen2((prevState) => !prevState);

  // const handleDropdownItemClick = (option, type)  => {
  //   if(type== 'firstParty')
  //   setSelectedOption(option);
  //   setDropdownOpen(!dropdownOpen);
  //   toggle();
  // };

  // let token = localStorage.getItem('token')

  const validateAndAddContract = () => {
    let isInvalid = false

    setIsValidating(true)

    if (title == '') {
      addToast(`Please add correct contract name`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (typeOfContract == '') {
      addToast(`Please add correct type of contract `, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (contractDetails == '') {
      addToast(`Please add contract details`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (startDate == '') {
      addToast(`Please add correct contract Start Date`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (endDate == '') {
      addToast(`Please add correct contract End Date`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (document == '') {
      addToast(`Please select contract agrement file`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }

    if (!isInvalid) {
      addContract()
    }

  }

  const resetInput = () => {
    setTypeOfContract('');
    setTitle('');
    setContractDetails('');
    setFirstParty('');
    setSecondParty('')
    setStartDate('')
    setEndDate('')
    setComment('')
    setDocument('')
  };

  const addContract = () => {

    const data = new FormData()
    data.append('typeOfContract', typeOfContract)
    data.append('title', title)
    data.append('contract', contractDetails)
    data.append('firstParty', decodedData?.orgId === 1? 'Org1': "Org2")
    data.append('secondParty', decodedData?.orgId === 1? 'Org2': "Org1")
    data.append('startDate', getTimeStamp(startDate))
    data.append('endDate', getTimeStamp(endDate))
    data.append('comment', comment)
    data.append('agreement', document)

    dispatch(AgreementAction.createAgreement(data)).then(()=> {
      addToast(`Agreement created successfully`, {
        appearance: 'success',
        autoDismiss: true,
      });
      toggle();
    }).catch((error)=> {
      alert(error)
    }).finally(()=> {
      resetInput()
      setIsValidating(false)
    })

  }

  const getFile = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setDocument(file)
      };
    }
  };

  const inputChangeHandler = (value, fieldName) => {
    switch (fieldName) {
      case 'title': setTitle(value); break;
      case 'typeOfContract': setTypeOfContract(value); break;
      case 'contractDetails': setContractDetails(value);break
      // case 'firstParty': setFirstParty(value); break;
      // case 'secondParty': setSecondParty(value); break;
      case 'startDate': setStartDate(value); break;
      case 'endDate': setEndDate(value); break;
      case 'comment':setComment(value); break;

      default:
        break;
    }
  }

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
        <ModalHeader toggle={toggle}>Add Contract Details</ModalHeader>
        {isLoading ? <ProgressBar /> :
          (<>

            <Card className="bg-secondary  px-md-2">
              <ModalBody>
                <FormGroup row>
                  <Label sm={2}>Title</Label>
                  <Col sm={10}>
                    <Input type="text" invalid={isValidating && title == ''} onChange={e => { inputChangeHandler(e.target.value, 'title') }} placeholder="Enter Title of Contract" />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <Form>
                  <FormGroup row>
                    <Label sm={2}>Contract Type</Label>
                    <Col sm={10}>
                      <Input invalid={isValidating && typeOfContract == ''} onChange={e => { inputChangeHandler(e.target.value, 'typeOfContract') }} placeholder="Enter Contract Type " />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={2}>Contract Details</Label>
                    <Col sm={10}>
                      <Input invalid={isValidating && contractDetails == ''} onChange={e => { inputChangeHandler(e.target.value, 'contractDetails') }} placeholder="Enter Contract Details " />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>

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
                    <Label sm={2}>First Party</Label>
                    <Col sm={10}>
                    <Label sm={2}>{decodedData?.orgId === 1? 'Org1': "Org2"}</Label>
                      {/* <Input invalid={isValidating && firstParty == ''} onChange={e => { inputChangeHandler(e.target.value, 'firstParty') }} placeholder="Enter First Party Name " /> */}
                      {/* <FormFeedback>*Required</FormFeedback> */}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="examplePassword" sm={2}>Second Party</Label>
                    <Col sm={10}>
                    <Label sm={2}>{decodedData?.orgId === 1? 'Org2': "Org1"}</Label>
                      {/* <Input type="text" invalid={isValidating && secondParty == ''} onChange={e => { inputChangeHandler(e.target.value, 'secondParty') }} placeholder="Enter Second Party Name" /> */}
                      {/* <FormFeedback>*Required</FormFeedback> */}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Start Date</Label>
                    <Col sm={10}>
                      <Input
                        invalid={isValidating && startDate == ''}
                        onChange={e => { inputChangeHandler(e.target.value, 'startDate') }}
                        type="date"
                        name="date"
                        id="exampleDate"
                        placeholder="date placeholder"
                      />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={2}>End Date</Label>
                    <Col sm={10}>
                      <Input
                        invalid={isValidating && endDate == ''}
                        onChange={e => { inputChangeHandler(e.target.value, 'endDate') }}
                        type="date"
                        name="date"
                        id="exampleDate"
                        placeholder="date placeholder"
                      />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                  <Label sm={2}>Comment</Label>
                  <Col sm={10}>
                    <Input type="text" invalid={isValidating && comment == ''} onChange={e => { inputChangeHandler(e.target.value, 'comment') }} placeholder="Enter comment " />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                  <FormGroup row>
                    <Col sm={2}>
                      <Label > Document</Label>
                    </Col>
                    <Col sm={1}>
                      <Label > : </Label>
                    </Col>
                    <Col sm={9}>
                      <CustomInput invalid={isValidating && document == ''} type="file" accept=".pdf, .PDF" onChange={e => { getFile(e) }} id="exampleCustomFileBrowser" name="customFile" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Card>

            <ModalFooter>
              <Button color="primary" onClick={() => { validateAndAddContract() }}>Submit Contract</Button>{' '}
              <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </>)
        }
      </Modal>
    </div>
  );
}

export default AddContract;