const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const organizationRoute = require('./organization.route');
const docsRoute = require('./docs.route');
const agreementRoute = require('./agreement.route')
const config = require('../../config/config');
const qsccRoute = require('./qscc.route')

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
    path: '/organizations',
    route: organizationRoute,
  },
  {
    path: '/agreements',
    route: agreementRoute,
  },
  {
    path: '/qscc',
    route: qsccRoute,
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
