//@ts-check
const config = require('../config/config');
const Organization = require('../models/organization.model');
const User = require('../models/user.model');
const { ORG_DEPARTMENT, USER_STATUS, USER_TYPE, ORG_TYPE } = require('./Constants');
const { registerUser } = require('./blockchainUtils');

const ingestBootstrapData = async () => {




  const staticOrgData = [
    { name: 'DTP', id: 1, parentId: 1, type: ORG_TYPE.DTP },
    { name: 'Exporter #1', id: 2, parentId: 1, type: ORG_TYPE.EXPORTER },
    { name: 'Bank #1', id: 3, parentId: 1, type: ORG_TYPE.BANK },
    { name: 'Transporter #1', id: 4, parentId: 1, type: ORG_TYPE.TRANSPORTER },
    { name: 'Wholesaler #1', id: 5, parentId: 1, type: ORG_TYPE.WHOLESALER },
    /**
     *  Exporter(id:2) all three (Invoice, eBL, ProofOfDelivery)
     *  Bank(id:3)        Only eBL
     *  Transporter(id:4) Only eBL
     *  Wholesaler(id:5)  Only Invoice 
     * */

  ];
  const staticUser = [
    {
      name: 'user 1',
      email: 'admin1211@gmail.com',
      orgId: 1,
      bcOrg: 1,
      password: config.commonPassword,
      department: ORG_DEPARTMENT.LEGAL,
      type: USER_TYPE.SUPER_ADMIN,
    },
    {
      name: 'user 1',
      email: 'admin1200@gmail.com',
      orgId: 2,
      bcOrg: 1,
      password: config.commonPassword,
      department: ORG_DEPARTMENT.LEGAL,
      type: USER_TYPE.ADMIN,
    },
    {
      name: 'User 2',
      email: 'admin1201@gmail.com',
      orgId: 3,
      bcOrg: 1,
      password: config.commonPassword,
      department: ORG_DEPARTMENT.LEGAL,
      type: USER_TYPE.ADMIN,
    },
    {
      name: 'User 3',
      email: 'admin1202@gmail.com',
      orgId: 4,
      bcOrg: 1,
      password: config.commonPassword,
      department: ORG_DEPARTMENT.LEGAL,
      type: USER_TYPE.ADMIN,
    },
    {
      name: 'User 4',
      email: 'admin1203@gmail.com',
      orgId: 5,
      bcOrg: 1,
      password: config.commonPassword,
      department: ORG_DEPARTMENT.LEGAL,
      type: USER_TYPE.ADMIN,
    },
  ];
  //org data
  for (let org of staticOrgData) {
    let orgData = await Organization.findOne({ id: org.id });
    if (!orgData) {
      let o = new Organization(org);
      await o.save();


      console.log('Ingesting static org data', org.name);
    } else {
      console.log('organization already exist', org.name);
    }
  }

  //user data
  for (let user of staticUser) {
    let userData = await User.findOne({ email: user.email });
    // console.log('user data is---', userData);
    if (!userData) {
      let newUser = new User({
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        password: user.password,
        status: USER_STATUS.ACTIVE,
        type: user.type,
        department: user.department,
      });
      try {
        //Blockchain Registration and Enrollment call
        let secret = await registerUser(`org${user.orgId}`, user.email);
        newUser.secret = secret
        newUser.isVerified = true
        newUser.orgType = staticOrgData?.find(o => o.id === user.orgId)?.type ?? 'default'
      } catch (error) {

      }
      await newUser.save();

      console.log('----ingest static user data--', user.email);
    } else {
      console.log('user email already exist', user.email);
    }
  }
};

module.exports = { ingestBootstrapData };
