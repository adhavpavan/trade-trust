const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const organizationRoute = require('./organization.route');
const lotRoute = require('./lot.route');
const docsRoute = require('./docs.route');
const agreementRoute = require('./agreement.route')
const config = require('../../config/config');
const qsccRoute = require('./qscc.route')
const pdfRoute = require('./pdf.route')

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/agreements',
    route: agreementRoute,
  },
  {
    path: '/qscc',
    route: qsccRoute,
  },
  {
    path: '/organizations',
    route: organizationRoute,
  },
  {
    path: '/pdf',
    route: pdfRoute,
  },
  {
    path: '/lots',
    route: lotRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
