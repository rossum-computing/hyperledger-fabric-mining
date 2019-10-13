#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

jq --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
	echo "Please Install 'jq' https://stedolan.github.io/jq/ to execute this script"
	echo
	exit 1
fi

starttime=$(date +%s)

# Print the usage message
function printHelp () {
  echo "Usage: "
  echo "  ./testAPIs.sh -l golang|node"
  echo "    -l <language> - chaincode language (defaults to \"golang\")"
}
# Language defaults to "golang"
LANGUAGE="golang"

# Parse commandline args
while getopts "h?l:" opt; do
  case "$opt" in
    h|\?)
      printHelp
      exit 0
    ;;
    l)  LANGUAGE=$OPTARG
    ;;
  esac
done

##set chaincode path
function setChaincodePath(){
	LANGUAGE=`echo "$LANGUAGE" | tr '[:upper:]' '[:lower:]'`
	case "$LANGUAGE" in
		"golang")
		CC_SRC_PATH="github.com/example_cc/go/mining"
		;;
		"node")
		CC_SRC_PATH="$PWD/artifacts/src/github.com/example_cc/node"
		;;
		*) printf "\n ------ Language $LANGUAGE is not supported yet ------\n"$
		exit 1
	esac
}

setChaincodePath


PORT=4000

echo "POST request Enroll on Org1  ..."
echo
ORG1_TOKEN=$(curl -s -X POST \
  http://localhost:$PORT/users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d 'username=Client2&orgName=Org1&userRole=mining_company')
echo $ORG1_TOKEN
ORG1_TOKEN=$(echo $ORG1_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG1 token is $ORG1_TOKEN"
echo
echo "POST request Enroll on Org2 ..."
echo
ORG2_TOKEN=$(curl -s -X POST \
  http://localhost:$PORT/users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d 'username=Mining2&orgName=Org2&userRole=ministry_of_mining')
echo $ORG2_TOKEN
ORG2_TOKEN=$(echo $ORG2_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG2 token is $ORG2_TOKEN"

echo "POST request Enroll on Org3 ..."
echo
ORG3_TOKEN=$(curl -s -X POST \
  http://localhost:$PORT/users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d 'username=Agri2&orgName=Org3&userRole=ministry_of_land')
echo $ORG3_TOKEN
ORG3_TOKEN=$(echo $ORG3_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG3 token is $ORG3_TOKEN"



echo


echo "POST invoke chaincode on peers of Org1 and Org2 and Org3"
echo
VALUES=$(curl -s -X POST \
  http://localhost:$PORT/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
  \"peers\": [\"peer0.org1.example.com\",\"peer0.org2.example.com\",\"peer0.org3.example.com\"],
  \"fcn\":\"submitClaim\",
  \"args\":[\"CLAIM3\",\"9.9.9.9\",\"gold\",\"2019\",\"2020\",\"hyd\",\"new\",\"28\",\"10000\",\"99\"]
}")
echo $VALUES
# Assign previous invoke transaction id  to TRX_ID
MESSAGE=$(echo $VALUES | jq -r ".message")
TRX_ID=${MESSAGE#*ID:}
echo




echo "Query chaincode on peers of Org1"
echo
curl -s -X POST \
  http://localhost:$PORT/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
  \"peers\": [\"peer0.org1.example.com\",\"peer0.org2.example.com\",\"peer0.org3.example.com\"],
  \"fcn\":\"queryAllClaims\",
  \"args\":[]
}"


queryClaim(){

echo
echo
echo "Query Claim chaincode on peers"
echo
curl -s -X POST \
  http://localhost:$PORT/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
  \"peers\": [\"peer0.org1.example.com\",\"peer0.org2.example.com\",\"peer0.org3.example.com\"],
  \"fcn\":\"queryClaim\",
  \"args\":[\"CLAIM3\"]
}"

}

echo
echo
echo "Approve chaincode on peers"
echo
curl -s -X POST \
  http://localhost:$PORT/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer $ORG2_TOKEN" \
  -H "content-type: application/json" \
  -d "{
  \"peers\": [\"peer0.org1.example.com\",\"peer0.org2.example.com\",\"peer0.org3.example.com\"],
  \"fcn\":\"approveClaim\",
  \"args\":[\"CLAIM3\",\"rama reddy\"]
}"

queryClaim

echo
echo
echo "Company submitted Transfer chaincode on peers "
echo
curl -s -X POST \
  http://localhost:$PORT/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
  \"peers\": [\"peer0.org1.example.com\",\"peer0.org2.example.com\",\"peer0.org3.example.com\"],
  \"fcn\":\"transferClaim\",
  \"args\":[\"CLAIM3\",\"uganda company\",\"100\"]
}"

queryClaim

rejectTransferClaim(){
echo
echo
echo "Approve Transfer chaincode on peers"
echo
curl -s -X POST \
  http://localhost:$PORT/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer $ORG3_TOKEN" \
  -H "content-type: application/json" \
  -d "{
  \"peers\": [\"peer0.org1.example.com\",\"peer0.org2.example.com\",\"peer0.org3.example.com\"],
  \"fcn\":\"transferClaimReject\",
  \"args\":[\"CLAIM3\",\"rossum1\",\"improper documents\"]
}"
}


rejectTransferClaim

queryClaim
echo
echo
echo "Approve Transfer chaincode on peers"
echo
curl -s -X POST \
  http://localhost:$PORT/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer $ORG3_TOKEN" \
  -H "content-type: application/json" \
  -d "{
  \"peers\": [\"peer0.org1.example.com\",\"peer0.org2.example.com\",\"peer0.org3.example.com\"],
  \"fcn\":\"transferClaimApprove\",
  \"args\":[\"CLAIM3\",\"rossum\",\"10\"]
}"


queryClaim
