const multer = require('multer');
const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
require('dotenv').config();
const httpStatus = require('http-status');
const config = require('../config/config');
const { getSuccessResponse } = require('./Response');

const logger = require('../logger')(module);

const getDataHash = (data) => {
  try {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    hash.write(data);
    hash.end();
    return hash.read();
  } catch (error) {
    console.log(`Error occurred while creating file data hash: Error: ${error}`);
    return null;
  }
};

aws.config.update({
  secretAccessKey: config.awsSecretAccess,
  accessKeyId: config.awsAccessKey,
  signatureVersion: 'v4',
  region: 'us-west-2',
});
const s3 = new aws.S3();
// 5MB Max File size allowed
const fileSizeLimit = 5242880; 

/**
 * destination - Directory where all the files will be saved
 * filename - Overwrites file name with orgId_logo / orgId_cover
 * limits - File size limit
 * fileFilter - Filters file based on mimetype
 */
const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, path.resolve(__dirname, '../../', 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}`);
    },
  }),
  limits: { fileSize: fileSizeLimit },
  fileFilter: (req, file, cb) => {
    console.log('MIME type :: ', file.mimetype);
    logger.info({ userInfo: req.loggerInfo, method: 'Upload', fileMimeType: file.mimetype });
    if (file.mimetype == 'application/pdf') {
      cb(null, !0);
    } else {
      return cb(new Error('Only .pdf format allowed!'));
    }
  },
});

const imageUpload = upload.fields([{ name: 'agreement', maxCount: 1 }]);

const validate = require('../middlewares/validate')
const agreementValidation = require('../validations/agreement.validation')

exports.uploadFileToS3 = async (req, res, next) => {
  logger.info({ userInfo: req.loggerInfo, method: 'uploadFileToS3' });
  imageUpload(req, res, async (err) => {
    try {
      let org = `org${req.loggerInfo.user.orgId}`
      const { value: data, error } = agreementValidation.createAgreement.prefs({ errors: { label: 'key' }, abortEarly: false  }).validate(req.body)
      if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return res.status(httpStatus.BAD_REQUEST).send(getSuccessResponse(httpStatus.BAD_REQUEST, errorMessage));
      }
      if (err) {
        logger.error({ userInfo: req.loggerInfo, method: 'uploadFileToS3', error: 'Error in imageUpload : ' + err });
        if (err.message == 'Unexpected field') {
          err.message = 'Invalid number of files / Invalid key in form data';
        }
        return res.status(httpStatus.FORBIDDEN).send(getSuccessResponse(httpStatus.FORBIDDEN, err.message));
      }
      if (req.body.isUpdate && !req.files?.length) {
        next();
      } else {
        const files = req.files;
        if (!files?.agreement?.length) {
          console.log('No files selected');
          logger.error({ userInfo: req.loggerInfo, method: 'uploadFileToS3', error: 'No files selected' });
          return res.status(httpStatus.FORBIDDEN).send(getSuccessResponse(httpStatus.FORBIDDEN, 'No files selected'));
        }
        if (req.files.agreement) {
          let fileMetadata = await uploadFile(req.files.agreement[0], org);
          logger.info({ userInfo: req.loggerInfo, method: 'uploadFileToS3', info: fileMetadata });
          req.body.fileMetadata = fileMetadata;
        }
        next();
      }
    } catch (error) {
      logger.error({ userInfo: req.loggerInfo, method: 'uploadDocument', error: error });
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(getSuccessResponse(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  });
};

const BUCKET_NAME = config.awsPrivateBucketName;
const BUCKET_ACL = 'authenticated-read';
const BUCKET_URL = `https://${BUCKET_NAME}.s3.amazonaws.com`;
// S3 url expiry timeIn seconds
const URL_EXPIRY_TIME = 3600;

exports.getSignedUrl = async (docID, orgName) => {
  return s3.getSignedUrlPromise('getObject', {
    Bucket: BUCKET_NAME +`/${orgName}`,
    Key: docID,
    Expires: URL_EXPIRY_TIME,
  });
};

const uploadFile = async (data, orgName) => {
  const fileData = fs.readFileSync(data.path);
  const originalFileName = data.originalname;
  let dataHash = getDataHash(fileData);
  const fileName = dataHash + '-' + originalFileName;
  let params = { Bucket: BUCKET_NAME + `/${orgName}`, Key: fileName, ACL: BUCKET_ACL, ContentType: data.mimetype, Body: fileData };
  let fileUrl = `${BUCKET_URL}/${fileName}`;
  await s3.putObject(params).promise();
  return { id: fileName,orgName, name: originalFileName.replace(/\.[^/.]+$/, ''), url: fileUrl, contentHash: dataHash };
};
module.exports.imageUpload = imageUpload;
module.exports.uploadFile = uploadFile;