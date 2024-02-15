
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, FormGroup, Card, CardTitle, CardHeader, ModalBody, Label, Col, Input, ModalFooter } from 'reactstrap';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import WorkIcon from './Icon'
import SchoolIcon from './Icon'
import StarIcon from './Icon'
import { GetFormattedDate } from '../../helper/utils';


import dateFormat from 'dateformat';

import { useDispatch, useSelector } from 'react-redux';
import * as AgreementAction from '../../actions/agreement';
import { useToasts } from 'react-toast-notifications';

const ContractView = (props) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const {
    buttonLabel,
    className,
    contractDetails,
    modal,
    toggle
  } = props;

  const isLoading = useSelector((state) => state.Agreement.isLoading);
  const approvals = useSelector((state) => state.Agreement.approvals);

  const [id, setId] = useState(contractDetails?.id);

  const getApprovals = () => {
    if (contractDetails?.id) {
      dispatch(AgreementAction.getAgreementApprovals(contractDetails?.id))
        .then(() => {
          addToast(`Approvals fetched-------------- successfully`, {
            appearance: 'success',
            autoDismiss: true,
          });
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    }
  };

  useEffect(() => {
    console.log(
      '----------------approval changes -----------333333--------',
      approvals
    );
    getApprovals();
  }, [contractDetails?.id]);

  console.log("========================================", props.contractDetails)



  return (
    <div style={{ background: 'rgb(33, 150, 243)', color: '#fff' }}>
      {/* <Button color="danger" onClick={toggle}>{buttonLabel}</Button> */}
      {contractDetails ? (
        <Modal isOpen={modal} toggle={toggle} className={className} size="lg">
          <ModalHeader className="border-0" toggle={toggle} bsSize='lg'>
            <h3 className="mb-0">Contract Details</h3> </ModalHeader>

          <Card className="bg-secondary px-md-2">
            <ModalBody >
              {/* {JSON.stringify(contractDetails)} */}
              <Card className="py-4 px-md-4">

             
              <FormGroup row>
                <Col sm={3}>
                  <Label>Title</Label>
                </Col>
                <Col sm={1}>
                  <Label>: </Label>
                </Col>
                <Col sm={8}>
                  <Label>{contractDetails.title}</Label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={3}>
                  <Label >Status</Label>
                </Col>
                <Col sm={1}>
                  <Label >:</Label>
                </Col>
                <Col sm={8}>
                  <Label for="exampleEmail" >{contractDetails.status}</Label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={3}>
                  <Label >First Party</Label>
                </Col>
                <Col sm={1}>
                  <Label >:</Label>
                </Col>
                <Col sm={8}>
                  <Label for="exampleEmail" >{contractDetails.firstParty}</Label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={3}>
                  <Label >Current Owner</Label>
                </Col>
                <Col sm={1}>
                  <Label >:</Label>
                </Col>
                <Col sm={8}>
                  <Label for="exampleEmail" >{contractDetails.owner}</Label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={3}>
                  <Label >Second Party</Label>
                </Col>
                <Col sm={1}>
                  <Label >:</Label>
                </Col>
                <Col sm={8}>
                  <Label for="exampleEmail" >{contractDetails.secondParty}</Label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={3}>
                  <Label >Start Date</Label>
                </Col>
                <Col sm={1}>
                  <Label >:</Label>
                </Col>
                <Col sm={8}>
                  <Label  >{dateFormat(contractDetails.startDate, "yyyy-mm-dd")}</Label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={3}>
                  <Label >End Date</Label>
                </Col>
                <Col sm={1}>
                  <Label >:</Label>
                </Col>
                <Col sm={8}>
                  <Label  >{dateFormat(contractDetails.endDate, "yyyy-mm-dd")}</Label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={3}>
                  <Label >Agrement File Name</Label>
                </Col>
                <Col sm={1}>
                  <Label >:</Label>
                </Col>
                <Col sm={8}>
                  <Label src={contractDetails.document.name} >{"Open File"}</Label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={3}>
                  <Label >Agrement File</Label>
                </Col>
                <Col sm={1}>
                  <Label >:</Label>
                </Col>
                <Col sm={8}>
                  {/* <Label href={contractDetails.document.url} >{"Open File"}</Label> */}
                  <a href={contractDetails.document.url} target="_blank">Show File</a>
                </Col>
              </FormGroup>
              </Card>
              <div >
                {/* <Label >Agrement Journey :</Label> */}
                <Card className="bg-secondary shadow" title="Agrement Journey" style={{ background: 'rgb(230, 230, 230)' }}>
                  {console.log("Contract details are", contractDetails)}
                  {/* <CardTitle>Agrement Journey</CardTitle> */}
                  <CardHeader className="border-0">
                    <h3 className="mb-0">Contract Journey</h3>
                  </CardHeader>
                  <VerticalTimeline>
                    {approvals?.map(step =>
                        <VerticalTimelineElement
                          className="vertical-timeline-element--work"
                          // contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                          contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                          date={dateFormat(step.addedAt, "yyyy-mm-dd")}
                          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                        // icon={<WorkIcon />}
                        >
                          {/* <h3 className="vertical-timeline-element-title">Number: {step.number}</h3> */}
                          <h4 className="vertical-timeline-element-subtitle"> Action : {step.action}</h4>
                          <h3 className="vertical-timeline-element-title">Status: {step.status}</h3>
                          <h4 className="vertical-timeline-element-subtitle"> User : {step.createBy}</h4>
                          <h4 className="vertical-timeline-element-subtitle">Comment : {step.comment}</h4>
                          <h4 className="vertical-timeline-element-subtitle">Department : {step.department}</h4>
                          <h4 className="vertical-timeline-element-subtitle">OrgId : {step.orgId}</h4>
                          {/* <p>
                    Creative Direction, User Experience, Visual Design, Project Management, Team Leading
                  </p> */}
                        </VerticalTimelineElement>

                      )}
                  </VerticalTimeline>

                  {/* <VerticalTimeline>
                  <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    // contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                    date="2011 - present"
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  // icon={<WorkIcon />}
                  >
                    <h3 className="vertical-timeline-element-title">Creative Director</h3>
                    <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
                    <p>
                      Creative Direction, User Experience, Visual Design, Project Management, Team Leading
                  </p>
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2010 - 2011"
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    // icon={<WorkIcon />}
                    dateClassName={{ color: 'white' }}
                  >
                    <h3 className="vertical-timeline-element-title">Art Director</h3>
                    <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
                    <p>
                      Creative Direction, User Experience, Visual Design, SEO, Online Marketing
            </p>
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2008 - 2010"
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    icon={<WorkIcon />}
                  >
                    <h3 className="vertical-timeline-element-title">Web Designer</h3>
                    <h4 className="vertical-timeline-element-subtitle">Los Angeles, CA</h4>
                    <p>
                      User Experience, Visual Design
            </p>
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2006 - 2008"
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    icon={<WorkIcon />}
                  >
                    <h3 className="vertical-timeline-element-title">Web Designer</h3>
                    <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
                    <p>
                      User Experience, Visual Design
            </p>
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                    className="vertical-timeline-element--education"
                    date="April 2013"
                    iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                  // icon={<SchoolIcon />}
                  >
                    <h3 className="vertical-timeline-element-title">Content Marketing for Web, Mobile and Social Media</h3>
                    <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
                    <p>
                      Strategy, Social Media
              </p>
                  </VerticalTimelineElement> */}
                  {/* <VerticalTimelineElement
              className="vertical-timeline-element--education"
              date="November 2012"
              iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
              icon={<SchoolIcon />}
            >
              <h3 className="vertical-timeline-element-title">Agile Development Scrum Master</h3>
              <h4 className="vertical-timeline-element-subtitle">Certification</h4>
              <p>
                Creative Direction, User Experience, Visual Design
              </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--education"
              date="2002 - 2006"
              iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }} rgb(22, 74, 74)
              icon={<SchoolIcon />}
            >
              <h3 className="vertical-timeline-element-title">Bachelor of Science in Interactive Digital Media Visual Imaging</h3>
              <h4 className="vertical-timeline-element-subtitle">Bachelor Degree</h4>
              <p>
                Creative Direction, Visual Design
              </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
              icon={<StarIcon />}
            /> */}
                  {/* </VerticalTimeline> */}
                </Card>
              </div>


            </ModalBody>

          </Card>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>OK</Button>{' '}
            {/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
          </ModalFooter>
        </Modal>
      ) : null}
    </div>
  );
}

export default ContractView;