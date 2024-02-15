let proposal = {
  fcn: 'test',
  args: ['data'],
  cc: 'fabcar',
  channel: 'mychannel',
};

const signedProposal = {
  signature,
  proposalBytes,
  certificate,
};

const proposalWithEndorsement = {
  signedProposal,
  endorsement: ['peer1', 'peer2'],
  rwSet: {
    r: { id: car1, name: 'Audi', version: 1 },
    w: { id: car1, name: 'Audi', version: 1 },
  },
};



const block = {
  tx1: { signedProposal, endorsement: ['peer1', 'peer2'] },
  tx2: { signedProposal, endorsement: ['peer1', 'peer2'] },
  signature: 'ordererSignature',
};
