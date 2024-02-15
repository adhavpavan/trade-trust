#!/bin/bash

# imports  
. envVar.sh
. utils.sh

CHANNEL_NAME='mychannel'

createChannel(){
    setGlobals 1
    osnadmin channel join --channelID $CHANNEL_NAME \
    --config-block ../channel-artifacts/${CHANNEL_NAME}.block -o localhost:7053 \
    --ca-file $ORDERER_CA \
    --client-cert $ORDERER_ADMIN_TLS_SIGN_CERT \
    --client-key $ORDERER_ADMIN_TLS_PRIVATE_KEY 

    setGlobals 1
    osnadmin channel join --channelID $CHANNEL_NAME \
    --config-block ../channel-artifacts/${CHANNEL_NAME}.block -o localhost:8053 \
    --ca-file $ORDERER_CA \
    --client-cert $ORDERER2_ADMIN_TLS_SIGN_CERT \
    --client-key $ORDERER2_ADMIN_TLS_PRIVATE_KEY 

    setGlobals 1
    osnadmin channel join --channelID $CHANNEL_NAME \
    --config-block ../channel-artifacts/${CHANNEL_NAME}.block -o localhost:9053 \
    --ca-file $ORDERER_CA \
    --client-cert $ORDERER3_ADMIN_TLS_SIGN_CERT \
    --client-key $ORDERER3_ADMIN_TLS_PRIVATE_KEY 

}

createChannel

sleep 3

joinChannel(){
    sleep 2
    FABRIC_CFG_PATH=$PWD/../artifacts/channel/config
    setGlobals 1
    peer channel join -b ../channel-artifacts/${CHANNEL_NAME}.block

    # sleep 2
    
    # setGlobals 2
    # peer channel join -b ../channel-artifacts/${CHANNEL_NAME}.block
    
}

joinChannel


# createChannel
# joinChannel
# setAnchorPeer