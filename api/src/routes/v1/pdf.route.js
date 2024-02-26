const express = require('express');
const { pdfController } = require('../../controllers');
const multer = require('multer');
const { adminAuth } = require('../../middlewares/auth');


const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router
  .route('/extract/delivery_proof')
  .post(
    // adminAuth,
    upload.single('pdf'),
     pdfController.parseDeliveryProofPDF);

router
    .route('/extract/invoice')
    .post(
      // adminAuth,
      upload.single('pdf'),
      pdfController.parseInvoicePDF);

router
    .route('/extract/house_bill')
    .post(
      // adminAuth,
      upload.single('pdf'),
      pdfController.parseHouseBillPDF);

router
.route('/verify_eBill/:id')
.post(
  // adminAuth,
  upload.single('pdf'),
  pdfController.verifyEBill);
  

module.exports = router;
