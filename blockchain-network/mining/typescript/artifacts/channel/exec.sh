../../../bin/configtxgen -outputBlock genesis.block -profile ThreeOrgsOrdererGenesis -channelID mychannel  -configPath /home/rossum/fabric-samples/mining/artifacts/channel
../../../bin/configtxgen -outputCreateChannelTx mychannel.tx -profile ThreeOrgsChannel -channelID mychannel   -configPath /home/rossum/fabric-samples/mining/artifacts/channel
../../../bin/configtxgen -outputAnchorPeersUpdate Org1MSPanchors.tx  -profile  ThreeOrgsChannel  -asOrg Org1MSP   -configPath /home/rossum/fabric-samples/mining/artifacts/channel
../../../bin/configtxgen -outputAnchorPeersUpdate Org2MSPanchors.tx  -profile  ThreeOrgsChannel  -asOrg Org2MSP   -configPath /home/rossum/fabric-samples/mining/artifacts/channel 
../../../bin/configtxgen -outputAnchorPeersUpdate Org3MSPanchors.tx  -profile  ThreeOrgsChannel  -asOrg Org3MSP   -configPath /home/rossum/fabric-samples/mining/artifacts/channel 

