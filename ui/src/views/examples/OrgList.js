import React, { useEffect, useState } from "react";
import Header from "../../components/Headers/Header";
import { useHistory } from "react-router-dom";
import { routes, headers } from "../../helper/config";
import NoDataCard from "./NoDataCard";
import ReactPaginate from "react-paginate";
import "./admin.css";

import ProgressBar from "./ProgressBar";
import {
  Badge,
  Card,
  CardHeader,
  FormGroup,
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
import { useDispatch, useSelector } from "react-redux";
import * as UserAction from "../../actions/user";
import Axios from "axios";
import AddOrg from "./AddOrg";
import * as OrgActions from "../../actions/organization";

export default function OrgList() {
  let history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.User.isLoading);
  const userList = useSelector((state) => state.User.userList);
  const userProfileData = useSelector(
    (state) => state?.User?.login?.decodedData
  );
  const orgList = [{
    "name": "Org1",
    "orgType": "Type 1."
  }, {
    "name": "Org2",
    "orgType": "Type 2"
  }, {
    "name": "Org3",
    "orgType": "Type 1"
  }, {
    "name": "Org4",
    "orgType": "Type 1"
  }, {
    "name": "Org5",
    "orgType": "Type 2"
  }];

  const [paginationData, setPaginationData] = useState({ selectedPage: 0 });
  // const [isLoading, setIsLoading] = useState(false)

  // const [userList, setUserList] = useState([])

  const [orgListData, setOrgListData] = useState([]);


  const [pageCount, setPageCount] = useState([]);

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);
  useEffect(() => {
    setPageCount(userList.totalPages);
  }, [userList]);

  // const fetchData = () => {
  //   Axios.get("http://localhost:3000/users")
  //     .then((response) => {
  //       const tableList = setData(response.data);
  //       console.log("printing axios data", tableList);
  //     })
  //     .catch((error) => {
  //       console.log("Error fetching data:", error);
  //     });
  // };

  // const handlePageClick = (data) => {
  //   const { selected } = data; // The selected page index

  //   // Update the current page based on the selected page index
  //   setCurrentPage(selected);
  // };

  const handlePageClick = (page) => {
    console.log("selected page is@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", page);
    setPaginationData({
      ...paginationData,
      selectedPage: page.selected,
    });
  };


  useEffect(() => {
    console.log(`-------------------------------`);

    const fetchData = async () => {
      try {
        const response = await dispatch(OrgActions.getORGList({
          page: paginationData.selectedPage,
          size: 10,
        }));
        console.log("response from org list", response);
        // Update state with fetched data
        setOrgListData(response);
      } catch (error) {
        console.error('Error fetching organization data:', error);
      }
    };

    fetchData(); // Fetch data when component mounts




  }, []);
  useEffect(() => {
    console.log("pagination data changed", paginationData);

    dispatch(OrgActions.getORGList({
      page: paginationData.selectedPage,
      size: 10,
    }));
  }, [paginationData]);





  // let view = userList?.docs?.map((user, i) => (
  //   <tr>
  //     <td> {user.name}</td>
  //     <td> {user.email}</td>
  //     <td> {user.status}</td>
  //     <td>{user.department}</td>
  //     <td>
  //       <Button
  //         className="my-1"
  //         color="primary"
  //         onClick={() => {
  //           updateUser(i, user.status);
  //         }}
  //         type="button"
  //       >
  //         {user.status == "active" ? "Deactivate" : "Activate"}
  //       </Button>
  //     </td>
  //   </tr>
  // ));
  let view = orgListData?.map((org, i) => (
    <tr>
      <td> {org.name}</td>
      <td> {org.type}</td>
    </tr>
  ));

  let progress = (
    <div>
      <Spinner type="grow" color="primary" />
      <Spinner type="grow" color="secondary" />
      <Spinner type="grow" color="success" />
      <Spinner type="grow" color="danger" />
      <Spinner type="grow" color="warning" />
      <Spinner type="grow" color="info" />
      <Spinner type="grow" color="light" />
      <Spinner type="grow" color="dark" />
    </div>
  );

  return (
    <div>
      <Header />
      {/* <ProgressBar/> */}
      {/* <span className="h1">This is Admin Component</span> */}
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
                    <Button className="my-1" color="primary" onClick={toggleModal} type="button">{"Add Organization"}</Button>
                  </Col>
                </FormGroup>
                {/* <h3 className="mb-0">User List</h3> */}

                <AddOrg toggle={toggleModal} modal={modal} />
              </CardHeader>
              {isLoading ? (
                <div className="row justify-content-center">
                  <ProgressBar />{" "}
                </div>
              ) : (
                <>
                  {orgList.length ? (
                    <>
                      <Table
                        className="align-items-center table-flush"
                        responsive
                      >
                        <thead className="thead-light">
                          <tr>
                            <th>Organization Name</th>
                            <th>Organization Type</th>

                            <th scope="col" />
                          </tr>
                        </thead>
                        <tbody>
                          {view}
                          {orgList.map((item, index) => {
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>{item.orgType}</td>
                            </tr>;
                          })}
                        </tbody>
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
                      {/* <div className="pagination">
                        <button
                          onClick={() => handlePageClick(currentPage - 1)}
                          disabled={currentPage === 0}
                        >
                          Previous
                        </button>
                        <span>Page {currentPage + 1}</span>
                        <button
                          onClick={() => handlePageClick(currentPage + 1)}
                          disabled={currentPage === pageCount - 1}
                        >
                          Next
                        </button>
                      </div>

                      <Items currentItems={1} /> */}
                    </>
                  ) : (
                    <NoDataCard status={"Users"} />
                  )}
                </>
              )}
            </Card>
            {/* </Card> */}
          </div>
        </Row>
      </Container>
      {/* <Paginate /> */}
    </div>
  );
}
