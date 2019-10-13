/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)
import "github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
// Define the Smart Contract structure
type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
type Claim struct {
        Coordinates   string  `json:"cord"`
	Ore           string  `json:"ore"`
	StartTime     string  `json:"start_time"`
	EndTime       string  `json:"end_time"`
	CompanyName   string  `json:"company_name"`
        RequestType   string  `json:"request_type"`
        Status        string  `json:"status"`
        SubmitDate    string  `json:"submiy_date"`
        ApproverName  string  `json:"approver_name"`
        Message       string  `json:"message"`
        Value         float64 `json:"value"`
        Volume        int    `json:"volume"`
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryClaim" {
		return s.queryClaim(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "submitClaim" {
		return s.submitClaim(APIstub, args)
	} else if function == "queryAllClaims" {
		return s.queryAllClaims(APIstub)
	} else if function == "approveClaim" {
		return s.approveClaim(APIstub, args)
	} else if function == "transferClaim" {
		return s.transferClaim(APIstub, args)
	} else if function == "transferClaimApprove" {
                return s.transferClaimApprove(APIstub, args)
	} else if function == "transferClaimReject" {
                return s.transferClaimReject(APIstub, args)
	} else if function == "rejectClaim" {
                return s.rejectClaim(APIstub, args)
	} else if function == "queryUser" {
		return s.queryUser(APIstub)
	}


	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryClaim(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	claimAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(claimAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	claims := []Claim{
                        Claim{Coordinates: "11.234597,13.9865252,-12.23456", Ore: "Gold", StartTime: "2018-11-03",
                              EndTime: "2018-12-30",CompanyName: "Obulapuram Mining Company", RequestType: "new",
                              Status: "submitted", SubmitDate: "2018-10-03",ApproverName: "", Value: 4000, Volume: 100},
                        Claim{Coordinates: "19.234597,20.9865252,21.23456", Ore: "Diamonds", StartTime: "2019-02-03",
                              EndTime: "2019-12-30",CompanyName: "Hyd Mining Company", RequestType: "new",
                              Status: "submitted", SubmitDate: "2018-10-03",ApproverName: "", Value: 500, Volume: 100},
	}

	i := 0
	for i < len(claims) {
		fmt.Println("i is ", i)
		claimAsBytes, _ := json.Marshal(claims[i])
		APIstub.PutState("CLAIM"+strconv.Itoa(i), claimAsBytes)
		fmt.Println("Added", claims[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) submitClaim(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 10 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	err := cid.AssertAttributeValue(APIstub, "user_role", "mining_company")
	if err != nil {
		return shim.Error("Failed to submit the claim request, only mining company can submit")
	}

	val, _ := strconv.ParseFloat(args[8], 64)
	vol, _ := strconv.Atoi(args[9])
        var claim = Claim{Coordinates: args[1], Ore: args[2], StartTime: args[3],
                         EndTime: args[4], CompanyName: args[5], RequestType: "new",
                         Status: args[6], SubmitDate: args[7], ApproverName: "", Value: val, Volume: vol}

	claimAsBytes, _ := json.Marshal(claim)
	APIstub.PutState(args[0], claimAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryUser(APIstub shim.ChaincodeStubInterface) sc.Response {
	a, _ := APIstub.GetCreator()
	return shim.Success(a)
}

func (s *SmartContract) queryAllClaims(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := ""
	endKey := ""

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllClaims:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) transferClaim(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	err := cid.AssertAttributeValue(APIstub, "user_role", "mining_company")
        if err != nil {
                return shim.Error("Failed to transfer the claim request, only Mining Company is authorized to do")
        }

	claimAsBytes, _ := APIstub.GetState(args[0])
	claim := Claim{}
	json.Unmarshal(claimAsBytes, &claim)

	if claim.RequestType != "new" || claim.Status != "approved"{
		return shim.Error("Transfer rejected :: Only Approved claim can be transffered.")
	}

	claim.CompanyName = args[1]
        claim.RequestType = "transfer"
	claim.Status = "pending"
        val, _ := strconv.ParseFloat(args[2], 64)
        claim.Value = val

	claimAsBytes, _ = json.Marshal(claim)
	APIstub.PutState(args[0], claimAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) transferClaimApprove(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

        if len(args) != 3 {
                return shim.Error("Incorrect number of arguments. Expecting 3")
        }

        err := cid.AssertAttributeValue(APIstub, "user_role", "ministry_of_land")
        if err != nil {
                return shim.Error("Failed to transfer the claim request, only Ministry Of Land is authorized to do")
        }

        claimAsBytes, _ := APIstub.GetState(args[0])
        claim := Claim{}
        json.Unmarshal(claimAsBytes, &claim)

        if claim.RequestType != "transfer"{
                return shim.Error("Transfer rejected :: Only Approved claim can be transffered.")
        }

        claim.ApproverName = args[1]
        claim.Status = "approved"
	val, _ := strconv.ParseFloat(args[2], 64)
	claim.Value = val

        claimAsBytes, _ = json.Marshal(claim)
        APIstub.PutState(args[0], claimAsBytes)

        return shim.Success(nil)
}

func (s *SmartContract) transferClaimReject(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

        if len(args) != 3 {
                return shim.Error("Incorrect number of arguments. Expecting 3")
        }

        err := cid.AssertAttributeValue(APIstub, "user_role", "ministry_of_land")
        if err != nil {
                return shim.Error("Failed to transfer the claim request, only Ministry Of Land is authorized to do")
        }

        claimAsBytes, _ := APIstub.GetState(args[0])
        claim := Claim{}
        json.Unmarshal(claimAsBytes, &claim)

        if claim.RequestType != "transfer" || claim.Status != "pending"{
                return shim.Error("Transfer rejected :: Only Approved claim can be transffered.")
        }

        claim.ApproverName = args[1]
        claim.Status = "rejected"
        claim.Message = args[2]

        claimAsBytes, _ = json.Marshal(claim)
        APIstub.PutState(args[0], claimAsBytes)

        return shim.Success(nil)
}

func (s *SmartContract) rejectClaim(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

        if len(args) != 3 {
                return shim.Error("Incorrect number of arguments. Expecting 3")
        }

        err := cid.AssertAttributeValue(APIstub, "user_role", "ministry_of_mining")
        if err != nil {
                return shim.Error("Failed to transfer the claim request, only Ministry Of Mining is authorized to do")
        }

        claimAsBytes, _ := APIstub.GetState(args[0])
        claim := Claim{}
        json.Unmarshal(claimAsBytes, &claim)

        if claim.RequestType != "new"{
                return shim.Error("Claim rejected :: Only New claim can be rejected.")
        }

        claim.ApproverName = args[1]
        claim.Status = "rejected"
        claim.Message = args[2]

        claimAsBytes, _ = json.Marshal(claim)
        APIstub.PutState(args[0], claimAsBytes)

        return shim.Success(nil)
}

func (s *SmartContract) approveClaim(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	err := cid.AssertAttributeValue(APIstub, "user_role", "ministry_of_mining")
        if err != nil {
                return shim.Error("Failed to approve the claim request, only Ministry Of Mining authorized to do")
        }

	claimAsBytes, _ := APIstub.GetState(args[0])
	claim := Claim{}

	json.Unmarshal(claimAsBytes, &claim)
        if claim.RequestType != "new"{
		return shim.Error("Approve rejected :: Only New claims can be approved.")
        }

	claim.Status = "approved"
        claim.ApproverName = args[1]

	claimAsBytes, _ = json.Marshal(claim)
	APIstub.PutState(args[0], claimAsBytes)

	return shim.Success(nil)
}


// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
