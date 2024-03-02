import React, { useState, useEffect, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import ProgressBar from './ProgressBar'
import { useToasts } from 'react-toast-notifications'
import { useDispatch, useSelector } from 'react-redux';
import Api from 'utils/Api';
import { headers } from 'helper/config';
import moment from 'moment';
const ViewLot = (props) => {
    const {
        className,
        modal,
        toggle,
        lotId,
    } = props;

    console.log("view lot props", props);

    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const [lotDetail, setLotDetail] = useState({});
    const decodedData = useSelector(
        (state) => state?.User?.login?.decodedData
    );

    const fetchLotDetail = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`/v1/lots/${lotId}`, headers());
            console.log(response);
            setLotDetail(response.data.payload);
        } catch (err) {
            // addToast("Failed to fetch lot details", {
            //     appearance: 'error'
            // });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLotDetail();
    }, [lotId])


    useEffect(() => {
    }, [decodedData])

    const documentTypesByOrg = [
        { orgId: 2, types: ['bills', 'invoices', 'PODs'] },
        { orgId: 3, types: ['bills'] },
        { orgId: 4, types: ['bills'] },
        { orgId: 5, types: ['invoices'] }
      ];





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
                                        <Col lg={10}>

                                            <FormGroup row>
                                                <Label sm={2} >Product</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.product}
                                                    />


                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Bank Id</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.bankerId}
                                                    />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Shipper Id</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.transporterId}
                                                    />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Wholesaler Id</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.wholesalerId}
                                                    />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Vendor</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.vendor}
                                                    />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Deadline</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={moment(lotDetail.deadlineDate).format('DD MMM YYYY')}
                                                    />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Ordering Date</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={moment(lotDetail.orderDate).format('DD MMM YYYY')}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Agreement Type</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.agreementType}
                                                    />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Quantity</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.qty}
                                                    />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Price</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}

                                                        value={lotDetail.price} />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Confirm Quantity</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.confirmQty}
                                                    />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Tax</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.tax}
                                                    />

                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Unit Of Measure</Label>
                                                <Col sm={5}>
                                                    <Input disabled={true}
                                                        value={lotDetail.unitOfMeasure}
                                                    />

                                                </Col>
                                            </FormGroup>

                                            {

<Fragment>
{/* Iterate over document types by organization ID */}
{documentTypesByOrg.map((org, index) => (
  <Fragment key={index}>
    {/* Render document types for each organization */}
    {(decodedData && decodedData.orgId === org.orgId) && org.types.map((type, idx) => (
      <FormGroup key={`${index}-${idx}`} row>
        {/* <Label>OrgId: {org.orgId} - {type}</Label> */}
        <Col>
          {/* Render links for each document type */}
          {lotDetail && lotDetail[type]?.map((item, i) => (
            <a key={i} href={item.metaData.url}>{item.metaData.name}</a>
          ))}
        </Col>
      </FormGroup>
    ))}
  </Fragment>
))}
</Fragment>
                                            }
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