# Build Your First Blockchain

## Follow the instructions given below

This is a Blockchain app desinged with the use case of Mining companies.


### Prerequisites
Make sure you have the following installed before proceeding.
- Ubuntu 18.04
- git - 2.10 or greater
- CURL - 7  or greater
- Docker - version 17.06.2-ce or greater
- Docker Compose - version 1.14.0 or greater
- Go - 1.12.x or greater (export PATH=$PATH:$GOPATH/bin)
- Nodejs - 8.9.4 or greater / 10.15.3 or greater
- NPM - 5.6.0 or greater
- Angular - 7 or greater

You can also follow this [link](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html) for further instructions.

### Downloads
Once you are done with prerequisites, you can begin by downloading this github repository and docker images.
Run the following commands in the Terminal.

`sudo curl -sSL http://bit.ly/2ysbOFE | bash -s`

`git clone https://github.com/rossum-computing/hyperledger-mining.git`

### Getting Started, A Network with two organisations
Now that Docker images and the git repository have been downloaded, we can proceed further.

- Go into "hyperledger-mining" folder.
- Here there is a "byfn.sh" script, we will use this to generate Network artifacts by running this command `./byfn.sh generate` .
- The above step generates certificates and keys for all the network entities.
- Then use the following command to start your Blockchain network `./byfn.sh up -a` .
- If everything goes well you will see that your network has been started in the Terminal.
- Only follow this step if you want to stop your Network `./byfn.sh down` .
-  Now run `sudo docker ps` command to see which Dockers are running, you will see that 2 organisations, certificate authority and orderer related nodes running.

For  detailed instructions, check out the official documentation of [Hyperledger facbric](https://hyperledger-fabric.readthedocs.io/en/latest/build_network.html).

### Adding Third Organisation to the Network
In this step we will use "eyfn.sh" file to add third organisation to our existing network.

- Type in the following command to add third organisation `./eyfn.sh up` .

If there are no errors when the above command is run, then the third organisation is successfully added to the network.

### Running Node application and testing RESTAPI
With the help of this Node application and the REST API calls built inside it, we can use our Blockchain Network. This is just an interface, we can do this in other methods as well.

- Go into "hyperledger-mining/mining" folder.
- Run this command `npm install` .
- Make sure all the packages get installed without errors.
- To run the node app use the following command `port=4000 node app` .
- Open a new terminal window to test RESTAPI, run `./testMinAPIs.sh` .

Make sure there are no errors occur before proceding to next step.

### Starting Frontend web application
To use the application we need a webpage interface, this was built with Angular 7.

- Go into "hyperledger-mining/mining_registrar" folder.
- Here run `npm install` command to install necessary packages for the angular app.
- Once the installation is done, run `ng serve -o` command, once the Angular files are compiled a webpage will be opened on "localhost:4200".

With this we will be able to interact with our Blockchain.

### Starting Blockchain Explorer
Blockchain Explorer is used to connect to the network and see comprehensive data about the transactions, blocks, chaincodes, etc, on the network.

- Follow the instructions in the [link](https://github.com/hyperledger/blockchain-explorer) to use the BlockChain explorer.

### Conclusion

With this a Blockchain network is deployed along with apps to monitor and interact with the Blockchain.