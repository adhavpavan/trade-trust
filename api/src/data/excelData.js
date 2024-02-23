let lotTransaction = {

  // Excel Sheet Fields
  vendor:"", // Farmer name
  deadlineDate:"",
  orderingDate:"",
  agreementType:"",
  product:"",
  quantity:"",
  price:"",
  confirmQuantity:"",
  enterTax:"",
  unit:"",
  lotNumber:"L44333",
  shipperReference:"P00059",//Exporter Id (referred everywhere)

  exporterId:"",//default populate
  shipperId:"",
  bankId:"",
  wholeSellerId:"",

  // transporterReferance:"",

  docType:"LOT",
  id:"",


}

let billOfLading = {
  eBLNumber:"",
  lotNumber:"1234",
  shipperReference:"P00059",//----------ForeignKey-----------------

  exporterId:"",
  wholeSellerId:"",
  consignee:"Test",
  doc:{
    id:"",
    contectHash:"",
    url:"",
    name:"",
    lotNumbers:["L44333",'L44335']
    
  },
  docType:"BILL_OF_LADING",
}

let invoice= {
  invoiceDate:"",
  invoiceId:"INV/2024/00011",
  dueDate:"",
  shipperReference:"", //----------ForeignKey-----------------

  exporterId:"",
  wholeSellerId:"",

  items:[{
    productName:"",
    quantity:"",
    unitprice:"",
    salesVAT:"",
    lotNumbers:["L44333"]
  }],
  doctType:"INVOICE",
}

let pod = {
  shipperReference:"S00082", //----------ForeignKey-----------------
  exporterId:"",
  wholeSellerId:"",
  shippingDate:"",
  productName:"",
  lotNumber:"",
  allPDFDate:"",
  lotNumbers:["L44333"]


}



let transportation= {
  PurchaseTransactionId:"",
  id:"",
  shipmentdate:"",
  arrivaldate:"",
  deliveryStatus:"In Transit",
  transporterId:1,
  exporterId:12,
  wholesellerId:34,
  goods:{
    goodsId:"",
    description:"",
    weight:12,
    unit:"kg",
    
  }

}





