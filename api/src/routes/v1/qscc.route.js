const express = require('express');
const qsccController = require('../../controllers/qscc.controller');
const {auth} = require('../../middlewares/auth');

const router = express.Router();

router.route('/block/:blockNumber').get(auth, qsccController.getBlock);
router.route('/tx/:txId').get(auth, qsccController.getTx);
module.exports = router;



