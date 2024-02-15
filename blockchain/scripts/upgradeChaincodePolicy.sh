. envVar.sh
. utils.sh

presetup() {
    echo Installing npm packages ...
    pushd ../artifacts/chaincode/javascript
    npm install
    popd
    echo Finished installing npm dependencies
}
# presetup

CHANNEL_NAME="mychannel"
CC_RUNTIME_LANGUAGE="node"
VERSION="1"
SEQUENCE=2
CC_SRC_PATH="../artifacts/chaincode/javascript"
CC_NAME="agreement"
CC_POLICY="AND('Org1MSP.peer','Org2MSP.peer')"

# packageChaincode() {
#     rm -rf ${CC_NAME}.tar.gz
#     setGlobals 1
#     peer lifecycle chaincode package ${CC_NAME}.tar.gz \
#         --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} \
#         --label ${CC_NAME}_${VERSION}
#     echo "===================== Chaincode is packaged ===================== "
# }
# # packageChaincode

# installChaincode() {
#     setGlobals 1
#     peer lifecycle chaincode install ${CC_NAME}.tar.gz
#     echo "===================== Chaincode is installed on peer0.org1 ===================== "

#     setGlobals 2
#     peer lifecycle chaincode install ${CC_NAME}.tar.gz
#     echo "===================== Chaincode is installed on peer0.org2 ===================== "
# }

# installChaincode

queryInstalled() {
    setGlobals 1
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID is ${PACKAGE_ID}
    echo "===================== Query installed successful on peer0.org1 on channel ===================== "
}

# queryInstalled

# --collections-config ./artifacts/private-data/collections_config.json \
#         --signature-policy "OR('Org1MSP.member','Org2MSP.member')" \

approveForMyOrg1() {
    setGlobals 1
    set -x
    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com --tls \
        --signature-policy ${CC_POLICY} \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --package-id ${PACKAGE_ID} \
        --sequence ${SEQUENCE}
    set +x

    echo "===================== chaincode approved from org 1 ===================== "

}
# queryInstalled
# approveForMyOrg1

# --signature-policy "OR ('Org1MSP.member')"
# --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA
# --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles $PEER0_ORG2_CA
#--channel-config-policy Channel/Application/Admins
# --signature-policy "OR ('Org1MSP.peer','Org2MSP.peer')"

checkCommitReadyness() {
    setGlobals 1
    peer lifecycle chaincode checkcommitreadiness \
        --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --signature-policy ${CC_POLICY} \
        --sequence ${SEQUENCE} --output json
    echo "===================== checking commit readyness from org 1 ===================== "
}

# checkCommitReadyness

approveForMyOrg2() {
    setGlobals 2

    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED \
        --signature-policy ${CC_POLICY} \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --version ${VERSION} --package-id ${PACKAGE_ID} \
        --sequence ${SEQUENCE}

    echo "===================== chaincode approved from org 2 ===================== "
}

# queryInstalled
# approveForMyOrg2

checkCommitReadyness() {

    setGlobals 2
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
        --signature-policy ${CC_POLICY} \
        --name ${CC_NAME} --version ${VERSION} --sequence ${SEQUENCE} --output json
    echo "===================== checking commit readyness from org 1 ===================== "
}

# checkCommitReadyness


commitChaincodeDefination() {
    setGlobals 1
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --signature-policy ${CC_POLICY} \
        --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
        --version ${VERSION} --sequence ${SEQUENCE}
}

# commitChaincodeDefination

queryCommitted() {
    setGlobals 1
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}

}

# queryCommitted

chaincodeInvoke() {
    setGlobals 1

    # Create Car
    peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME}  \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA   \
        -c '{"function": "CreateContract","Args":["{\"id\":\"2\", \"test\":\"data\"}"]}'

}

# chaincodeInvoke

chaincodeQuery() {
    setGlobals 2
    peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "getAssetByID","Args":["2"]}'
}

# chaincodeQuery




# Run this function if you add any new dependency in chaincode
presetup

queryInstalled
approveForMyOrg1
checkCommitReadyness
approveForMyOrg2
checkCommitReadyness
commitChaincodeDefination
queryCommitted
sleep 3
chaincodeInvoke
sleep 3
chaincodeQuery
