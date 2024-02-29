import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { useDispatch, useSelector } from 'react-redux';
const ViewLot = (props) => {
    const {
        className,
        modal,
        toggle,
        lotId,
    } = props;

    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const decodedData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    useEffect(() => {
        console.log("-----------------qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq----------------------", decodedData)
    }, [decodedData])





    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
                <ModalHeader toggle={toggle}>Lot Detail</ModalHeader>
                {isLoading ? <ProgressBar /> :
                    (<>

                        <Card className="bg-secondary  px-md-2">
                            <ModalBody>
                                <Form>
                                    <FormGroup row>
                                        <Label sm={2} >Product</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Bank Id</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Shipper Id</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >WholeSeller Id</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Vendor</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Deadline</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Ordering Date</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Agreement Type</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Quantity</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Price</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Confirm Quantity</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Tax</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2} >Unit Of Measure</Label>
                                        <Col sm={10}>
                                            <Input disabled={true} />

                                        </Col>
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                        </Card>

                        <ModalFooter>
                            <Button color="secondary" onClick={() => {
                                // resetInput();
                                toggle();
                            }}>Cancel</Button>
                        </ModalFooter>
                    </>)
                }
            </Modal>
        </div>
    );
}
export default ViewLot;