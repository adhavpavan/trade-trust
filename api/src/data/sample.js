let lotTransaction = {
  id:"",
  productName:"Apple",
  lotNumber:"L44333",
  netWeight:10,
  unit:"kg",
  grossWeight:11,

  orderId:"S1234",
  description:"",

  exporterId:"",
  shipperIdId:"",
  bankId:"",
  wholeSellerId:"",

  exporterReference:"",
  transporterReferance:"",

  Farmer:"",
  FarmerID:"",
  farmerAddress:"",

  transactions:[
    {
      type:"",
      comment:"",
      date:"",
    }
  ],

  status:"bought",
  purchaseDate:"",
  docType:"LOT",

}

let billOfLading = {
  eBLNumber:"",
  exporterId:"",
  lotNumber:"1234",
  wholeSellerId:"",
  exporterReference:"",
  transporterReferance:"",
  consignee:"Test",
  docType:"BILL_OF_LADING",
  doc:{
    id:"",
    contectHash:"",
    url:"",
    name:"",

  }
}

let invoice= {
  invoiceDate:"",
  invoiceId:"INV/2024/00011",
  dueDate:"",
  doctType:"INVOICE",
  exporterReference:"",
  exporterId:"",
  wholeSellerId:"",
  items:[{
    productName:"",
    quantity:"",
    unitprice:"",
    salesVAT:"",
  }]
}

let pod = {
  exporterReference:"",
  exporterId:"",
  wholeSellerId:"",
  shippingDate:"",
  productName:"",
  lotNumber:"",


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








