const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    ENV: Joi.string().valid('prod', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    MONGODB_USERNAME: Joi.string().required().description('Mongodb username'),
    MONGODB_PASSWORD: Joi.string().required().description('Mongodb password'),
    MONGODB_HOST: Joi.string().required().description('Mongodb host'),
    MONGODB_NAME: Joi.string().required().description('Mongodb name'),
    CA_ADMIN_ID: Joi.string().required().description('CA admin user name'),
    CA_ADMIN_SECRET: Joi.string().required().description('ca admin password'),
    AWS_SECRET_ACCESS: Joi.string().required().description('AW Secret Required'),
    AWS_ACCESS_KEY: Joi.string().required().description('AWS Access key required'),
    AWS_PRIVATE_BUCKET_NAME: Joi.string().required().description('AWS Access key required'),
    COMMON_PASSWORD:Joi.string().required().description("Add common password")
    
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

let srv = '';
// TOD): Change port for each different org
if (envVars.MONGODB_HOST !== 'localhost:27011') {
  srv = '+srv';
}

module.exports = {
  env: envVars.ENV,
  port: envVars.PORT,
  caAdminId: envVars.CA_ADMIN_ID,
  caAdminSecret: envVars.CA_ADMIN_SECRET,
  awsAccessKey:envVars.AWS_ACCESS_KEY,
  awsSecretAccess: envVars.AWS_SECRET_ACCESS,
  awsPrivateBucketName: envVars.AWS_PRIVATE_BUCKET_NAME,
  commonPassword:envVars.COMMON_PASSWORD,
  mongoose: {
    url: `mongodb${srv}://${envVars.MONGODB_USERNAME}:${envVars.MONGODB_PASSWORD}@${envVars.MONGODB_HOST}/${envVars.MONGODB_NAME}?retryWrites=true&w=majority&authSource=admin`,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};
