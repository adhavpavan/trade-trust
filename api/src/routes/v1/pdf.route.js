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
     pdfController.parsePDF);
  

module.exports = router;
