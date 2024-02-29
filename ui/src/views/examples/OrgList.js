import React, { useEffect, useState } from "react";
import Header from "../../components/Headers/Header";
import { useHistory } from "react-router-dom";
import NoDataCard from "./NoDataCard";
import ReactPaginate from "react-paginate";
import "./admin.css";

import ProgressBar from "./ProgressBar";
import {
  Card,
  CardHeader,
  FormGroup,
  Table,
  Container,
  Spinner,
  Row,
  Button,
  Col,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import AddOrg from "./AddOrg";
import * as OrgActions from "../../actions/organization";


export default function OrgList() {
  let history = useHistory();
  const dispatch = useDispatch();
  const organizationState = useSelector((state) => state.Organization.orgList);
  const { totalPages } = organizationState;
  const orgList = useSelector((state) => state.Organization.orgList.docs);
  const [paginationData, setPaginationData] = useState({ selectedPage: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  useEffect(() => {
    setPageCount(totalPages);
  }, [organizationState]);

  const handlePageClick = async (page) => {
    console.log("page clicked", page);
    setPaginationData({
      // ...paginationData,
      selectedPage: page.selected,

    });
    // await fetchData();
  };



  const fetchData = async () => {
    setIsLoading(true);
    dispatch(
      OrgActions.getORGList({
        pagination: paginationData.selectedPage,
        size: 5,
      })
    );
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [paginationData]);
  let view = orgList?.map((org, i) => (
    <tr key={i}>
      <td> {org.name}</td>
      <td> {org.type}</td>
    </tr>
  ));

  return (
    <div>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <FormGroup row>
                  <Col sm={9}>
                    <h3 className="mb-0">Organization List</h3>
                  </Col>
                  <Col sm={3}>
                    <Button
                      className="my-1"
                      color="primary"
                      onClick={toggleModal}
                      type="button"
                    >
                      Add Organization
                    </Button>
                  </Col>
                </FormGroup>
                <AddOrg toggle={toggleModal} modal={modal} />
              </CardHeader>
              {isLoading ? (
                <div className="row justify-content-center">
                  <ProgressBar />
                </div>
              ) : (
                <>
                  {orgList?.length !== 0 ? (
                    <>
                      <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                          <tr>
                            <th>Organization Name</th>
                            <th>Organization Type</th>
                          </tr>
                        </thead>
                        <tbody>{view}</tbody>
                      </Table>
                      <Container>
                        <Row>
                          <Col>
                            <hr />
                          </Col>
                        </Row>
                      </Container>
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={3}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                      />
                    </>
                  ) : (
                    <NoDataCard status={"Org"} />
                  )}
                </>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </div>
  );
}
