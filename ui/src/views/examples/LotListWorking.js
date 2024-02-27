import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./admin.css";
import '../../reducers/lot';
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
  Dropdown,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
// import * as LotAction from "../../actions/lot";
import * as LotActions from "../../actions/lot";
import "../../reducers/lot";
import UploadPDF from "./UploadPDF";

export default function LotList() {
  const lotListData = [{
    "lotNumber": "123",
    "shipperId": "123QWERTT",
    "wholeSellerId": "QWERTY123",
    "bankId": "123QWERTY123",
  }, {
    "lotNumber": "234",
    "shipperId": "234QWERTT",
    "wholeSellerId": "QWERTY234",
    "bankId": "234QWERTY234",
  }, {
    "lotNumber": "345",
    "shipperId": "345QWERTT",
    "wholeSellerId": "QWERTY345",
    "bankId": "345QWERTY345",
  }, {
    "lotNumber": "456",
    "shipperId": "456QWERTT",
    "wholeSellerId": "QWERTY456",
    "bankId": "456QWERTY456",
  }, {
    "lotNumber": "567",
    "shipperId": "567QWERTT",
    "wholeSellerId": "QWERTY567",
    "bankId": "567QWERTY567",
  },];

  let history = useHistory();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [isBill, setIsBill] = useState(true);
  // const lotState = useSelector((state) => state.LotData.lots);
  console.log("Here *****************");
  const newLot = useSelector((state) => console.log(state));

  const lotState = useSelector((state) => state.LotData.lots);
  // const lot_List = useSelector((state) => state.Lot.lotList.docs);
  const { totalPages } = lotState;
  const listOfLot = useSelector((state) => state.LotData.lots?.doc);


  const [paginationData, setPaginationData] = useState({ selectedPage: 0 });
  const [isLoading, setIsLoading] = useState(false)

  // const [userList, setUserList] = useState([])

  // const [lotList, setorgList] = useState([]);


  const [pageCount, setPageCount] = useState([]);

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  useEffect(() => {
    setPageCount(totalPages + 1);
  }, [lotState]);

  const handlePageClick = async (page) => {
    setPaginationData({
      ...paginationData,
      selectedPage: page.selected,
    });
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("********** Page ***********");
    // console.log(page);
    console.log(paginationData.selectedPage);
    setIsLoading(true);
    dispatch(
      LotActions.getLOTList({
        pagination: paginationData.selectedPage,
        size: 5,
      })
    );
    setIsLoading(false);
  };

  console.log("*********** listOfLot **********");
  console.log(listOfLot?.length);

  const toggleDropdown = (itemId) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId] // Toggle dropdown state for the specific item
    }));
  };
  const handleOptionClick = (bill) => {
    // Handle option click for a specific item
    setIsBill(bill);
    console.log(`Option ${isBill}`);
    toggleModal();

  };


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
  let view = lotListData?.map((lot, i) => (
    <tr key={i}>
      <td> {lot.lotNumber}</td>
      <td> {lot.shipperId}</td>
      <td> {lot.wholeSellerId}</td>
      <td> {lot.bankId}</td>
      <td>
        <Dropdown isOpen={dropdownOpen[lot.lotNumber]} toggle={() => toggleDropdown(lot.lotNumber)}>
          <DropdownToggle caret={false}>
            {/* Icon representing the menu */}
            <i className="fas fa-ellipsis-v"></i>
          </DropdownToggle>
          <DropdownMenu>
            {/* Menu items */}
            <DropdownItem onClick={(e) => {
              e.preventDefault();
              handleOptionClick(true);
            }}>Uplod Bill</DropdownItem>
            <DropdownItem onClick={(e) => {
              e.preventDefault();
              handleOptionClick(false);
            }}>Uplod Invoice</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </td>
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
  if (isLoading) {
    return (<>
      <Card body></Card>
    </>);
  }
  return (
    <>
      <Card body>
        <Table className="align-items-center table-flush"
          responsive>
          <thead className="thead-light">
            <tr>
              <th>Lot Number</th>
              <th>Shipper Id</th>
              <th>WholeSeller Id</th>
              <th>Bank Id</th>
              <th>Documents</th>

              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {view}
            {/* {lotList.map((item, index) => {
              <tr key={index}>
                <td>{item.lotNumber}</td>
                <td>{item.shipperId}</td>
                <td>{item.wholeSellerId}</td>
                <td>{item.bankId}</td>
              </tr>;
            })} */}
          </tbody>
        </Table>

        <UploadPDF toggle={toggleModal} isBill={isBill} onNewClick={false} modal={modal} />
      </Card>
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
  );
}

{/* <Card body>
                {isLoading ? (
                  <div className="row justify-content-center">
                    <ProgressBar />{" "}
                  </div>
                ) : (
                  <>
                    {userList?.docs?.length ? (
                      <>
                        <Table
                          className="align-items-center table-flush"
                          responsive
                        >
                          <thead className="thead-light">
                            <tr>
                              <th>Username</th>
                              <th>Email</th>
                              <th scope="col">Status</th>
                              <th scope="col">Department</th>
                              <th scope="col">Action</th>

                              <th scope="col" />
                            </tr>
                          </thead>
                          <tbody>
                            {view}
                            {userList.docs.map((item, index) => {
                              <tr key={index}>
                                <td>{item.Username}</td>
                                <td>{item.Email}</td>
                                <td>{item.Status}</td>
                                <td>{item.Department}</td>
                                <td>{item.Action}</td>
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
                        /> */}
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
                        </div> */}

{/* <Items currentItems={1} /> */ }
{/* </>
                    ) : (
                      <NoDataCard status={"Users"} />
                    )}
                  </>
                )}
              </Card> */}
//   );
// }
