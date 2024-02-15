'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const CredibleAsset = require('../lib/credible');

let assert = sinon.assert;
chai.use(sinonChai);

describe('Chaincode', () => {
    let sandbox;
    let asset;
    let ctx;
    let mockStub;

    describe('Asset', () => {
        beforeEach('Sandbox creation', () => {
            sandbox = sinon.createSandbox();
            asset = new CredibleAsset('credible');

            ctx = sinon.createStubInstance(Context);
            mockStub = sinon.createStubInstance(ChaincodeStub);
            ctx.stub = mockStub;

            mockStub.putState.resolves('some state');
            mockStub.setEvent.returns('set event');

        });

        afterEach('Sandbox restoration', () => {
            sandbox.restore();
        });

        describe('Create', () => {
            let expectedAsset = {}
            before('Expected Asset', () => {
                expectedAsset = `{"ID":"1","Color":"red","Size":"small","Owner":"user1","AppraisedValue":"5000"}`
            })
            it('should create successfully', async () => {
                const response = await asset.CreateAsset(ctx, "1", "red", "small", "user1", "5000");
                // console.log(response);
                // sinon.assert.calledWith(mockStub.getState, 'ID');
                expect(response).to.equals(expectedAsset);
            });
        });

        describe('Create Duplicate', () => {
            let expectedAsset = {}
            before('Expected Asset', () => {
                expectedAsset = `{"ID":"1","Color":"red","Size":"small","Owner":"user1","AppraisedValue":"5000"}`
            })
            it('should fail to create', async () => {
                let duplicateAssetError = `Asset with id 1 already exists. can not create again.`
                mockStub.getState.resolves(expectedAsset)

                const response = await asset.CreateAsset(ctx, "1", "red", "small", "user1", "5000");
                // console.log("response : ", response.message)

                expect(response.message).to.equals(duplicateAssetError)
            });
        });

        describe('Get', () => {
            it('ID should match', async () => {
                mockStub.getState.resolves(`{"ID":"11","Color":"red","Size":"small","Owner":"user1","AppraisedValue":"5000"}`)

                const asset11 = await asset.ReadAsset(ctx, "11")
                // console.log("assetID : ", JSON.parse(asset11).ID);
                let returnedID = JSON.parse(asset11).ID
                expect(returnedID).to.equals('11')

            });
        });

        describe.skip('Get with Pagination', () => {
            it('should match', async () => {
                let expectedAsset = {
                    data: [
                        { "ID": "11", "Color": "red", "Size": "small", "Owner": "user1", "AppraisedValue": "5000" },
                        { "ID": "12", "Color": "red", "Size": "small", "Owner": "user1", "AppraisedValue": "5000" }
                    ],
                    metadata: {
                        RecordsCount: 2,
                        Bookmark: "qwerty",
                    }
                }

                mockStub.getQueryResultWithPagination.resolves(expectedAsset)

                const receivedAsset = await asset.GetAssetsWithPagination(ctx, { "Owner": "user1" }, 2, "")
                console.log("receivedAsset : ", JSON.parse(receivedAsset));
                // let returnedID = JSON.parse(asset11).ID
                // expect(returnedID).to.equals('12')

            });
        });
    })
})
