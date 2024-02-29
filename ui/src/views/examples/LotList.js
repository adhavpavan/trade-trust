import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./admin.css";
import ProgressBar from "./ProgressBar";
import {
  Card,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Table,
  Container,
  Spinner,
  Row,
  Col,
  Dropdown, Button,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import * as LotActions from "../../actions/lot";
import UploadPDF from "./UploadPdf";
import NoDataCard from "./NoDataCard";
import ViewLot from "./ViewLot";

export default function LotList() {

  let history = useHistory();
  const dispatch = useDispatch();
  const lotState = useSelector((state) => state.LotData?.lotList);
  // const { totalPages } = lotState;
  const totalPages = useSelector((state) => state.LotData?.lotList?.totalPages);
  // const lotList = useSelector((state) => state.LotData?.lotList?.docs);
  const [lotList, setLotList] = useState([]);

  const [paginationData, setPaginationData] = useState({ selectedPage: 0 });
  const [isLoading, setIsLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [pdfType, setTypeOfPDF] = useState('');
  const [lotId, setlotId] = useState(0);
  const [pageCount, setPageCount] = useState([]);

  const userData = useSelector((state) => state?.User?.login?.decodedData);
  const [modal, setModal] = useState(false);
  const [modalView, setModalView] = useState(false);

  const toggleModal = () => setModal(!modal);
  const toggleViewModal = () => setModalView(!modalView);

  useEffect(() => {
    setPageCount(totalPages);
  }, [lotState]);

  const handlePageClick = (page) => {
    setPaginationData({
      ...paginationData,
      selectedPage: page.selected,
    });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const list = await dispatch(
      LotActions.getLotList({
        pagination: paginationData.selectedPage,
        size: 5,
      })
    );

    setLotList(list);


    setIsLoading(false);
  };

  const toggleDropdown = (itemId) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId] // Toggle dropdown state for the specific item
    }));
  };

  const handleOptionClick = (typeOfDoc, itemId) => {
    // Handle option click for a specific item
    setTypeOfPDF(typeOfDoc);
    setlotId(itemId);
    console.log(`Option ${pdfType}`);
    toggleModal();

  };


  let view = lotList?.docs?.map((lot, i) => (
    <tr key={i}>
      <td> {lot.product}</td>
      <td> {lot.unitOfMeasure}</td>
      <td> {lot.vendor}</td>
      <td> {lot.agreementType}</td>
      <td>
        <Dropdown isOpen={dropdownOpen[lot.id]} toggle={() => toggleDropdown(lot.id)}>
          <DropdownToggle caret={false}>
            {/* Icon representing the menu */}
            <i className="fas fa-ellipsis-v"></i>
          </DropdownToggle>
          <DropdownMenu>{
            userData?.orgId === 3 || userData?.orgId === 4 ?
              <>
                <DropdownItem onClick={(e) => {
                  e.preventDefault();
                  handleOptionClick('Bill', lot.id);
                }}>Uplod Bill</DropdownItem>
              </>
              : userData?.orgId === 5 ? <>
                <DropdownItem onClick={(e) => {
                  e.preventDefault();
                  handleOptionClick('Invoice', lot.id);
                }}>Uplod Invoice</DropdownItem></> : userData?.orgId === 1 || userData?.orgId === 2 ?
                <>
                  {/* Menu items */}
                  <DropdownItem onClick={(e) => {
                    e.preventDefault();
                    handleOptionClick('Bill', lot.id);
                  }}>Uplod Bill</DropdownItem>
                  <DropdownItem onClick={(e) => {
                    e.preventDefault();
                    handleOptionClick('Invoice', lot.id);
                  }}>Uplod Invoice</DropdownItem>
                  <DropdownItem onClick={(e) => {
                    e.preventDefault();
                    handleOptionClick('Proof Of Delivery', lot.id);
                  }}>Uplod Proof Of Delivery</DropdownItem></> : <></>
          }
          </DropdownMenu>
        </Dropdown>
      </td>
      <td>
        <Button
          className="my-1"
          color="primary"
          onClick={toggleViewModal}
          type="button"
        >
          View
        </Button>
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


  return (
    <>
      <Card body>
        {
          isLoading ?
            <div className="row justify-content-center">
              <ProgressBar />
            </div> : lotList?.length !== 0 ?
              <Table className="align-items-center table-flush"
                responsive>
                <thead className="thead-light">
                  <tr>
                    <th>Product</th>
                    <th>Unit Of Measure</th>
                    <th>Vendor</th>
                    <th>agreementType</th>
                    <th>Documents</th>
                    <th></th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {view}
                </tbody>
              </Table> : <NoDataCard status={"Lot"} />
        }
        <UploadPDF toggle={toggleModal} typeOfPDF={pdfType} onNewClick={false} modal={modal} lotId={lotId} />
        <ViewLot toggle={toggleViewModal} modal={modalView} lotId={lotId} />
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
