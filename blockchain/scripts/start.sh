

# All steps for running network
# 1)Create Certificate authority for all organization
docker-compose -f ../artifacts/channel/create-certificate-with-ca/docker-compose.yaml   up -d
# --------------------------------------------------------------------------------------------

# Note: We are considering , we already created all participants certioficates

# 2) Create Artifacts
cd ../artifacts/channel/ && ./create-artifacts.sh

cd ..
#  3) Run all services(peer, orderer, couchdb)
docker-compose -f ../artifacts/docker-compose.yaml   up -d

cd ../scripts
# 4) Craete Channel
./createChannel.sh

# 5) Deploy chaincode
./deployChaincode.sh