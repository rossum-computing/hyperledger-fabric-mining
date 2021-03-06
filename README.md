
# Mining Lands Management app built with Blockchain

#### Description
Management of assets means assigning respective assets to particular party through required process and approvals which means various organisations (both government and private mining companies) communicate with eachother regarding land claims, transfers, etc. 

#### Problem Statement
In area of Land and Agriculture if an organization requires to buy or take lease on land of mining or agriculture require to go through the process and approvals which is not in a stream lined process, there is a very good chance of hacking/modifying the asset data by the officials and skip the process which is a huge loss for the government and inturn general public.

#### Solution
The idea is to implement blockchain technology for this to ensure maximum security. If the whole information is on blockchain network, it makes the data tamper proof. Then based on required roles and policies, only authorized persons/organisations can invoke transactions. Also every change is recorded by the system and it can be viewed by all organisations who has access to it.

There are 4 different roles for organisations that will be connected to the network, which are described below.

#### Ministry of Mining
#### Ministry Land and Agriculture
#### Ministry of Finance
#### Mining Company

## Flowchart
![](https://github.com/rossum-computing/hyperledger-fabric-mining/blob/master/assets/mining_flowchart.jpg)


## Follow the instructions given below

This is a Blockchain app desinged with the use case of Mining companies.


### Prerequisites
Make sure you have the following installed before proceeding.
- Ubuntu 18.04
- git - 2.10 or greater
	- `sudo apt install git`
- CURL - 7  or greater
	 - `sudo apt install curl`
- Docker - 17.06.2-ce or greater
	- `sudo snap install docker`
	- This command will also install docker-compose
- Docker Compose - 1.14.0 or greater
- VS Code - 1.3 or greater
	- `sudo snap install code --classic`
- Go - 1.12.x or greater
	- Click this [link](https://dl.google.com/go/go1.13.1.linux-amd64.tar.gz) to download Go.
	- Once downloaded execute the following commands.
	- `cd ~/Downloads`
	- Extract the downloaded file using folloing command.
	- `sudo tar -C /usr/local -xzf go1.13.1.linux-amd64.tar.gz`
	- Now we need to export Go lang path to "bashrc" file using VS code.
	- `code ~/.bashrc`
	- Add the following line to the end of previosly opened file and save it.
	- `export PATH=$PATH:/usr/local/go/bin`
	- `source ~/.bashrc`
- Nodejs - 8.9.4 or greater / 10.15.3 or greater
	- `sudo apt install nodejs`
- NPM - 5.6.0 or greater
	- `sudo apt install npm`
	- `npm install npm@5.6.0 -g`
- Angular - 7 or greater
	- `sudo npm install -g @angular/cli`
- jq - 1.4 or greater
	- `sudo snap install jq`

You can also follow this [link](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html) for further instructions.
Any other installation methods can be followed, as long as the downloaded version satisfy the requirement.

### Optional - add docker to sudo
To run docker with out sudo run the following commands.

- `sudo groupadd docker`
- `sudo gpasswd -a $USER docker`
- `newgrp docker`
- Logout/restart for the changes to take effect.

### Downloads
Once you are done with prerequisites, you can begin by downloading this github repository and docker images.
Run the following commands in the Terminal.

- `curl -sSL http://bit.ly/2ysbOFE | sudo bash -s -- 1.4.2 1.4.2 0.4.15`

- `git clone https://github.com/rossum-computing/hyperledger-fabric-mining.git`

### Getting Started, A Network with two organisations
Now that Docker images and the git repository have been downloaded, we can proceed further.

- Go into "hyperledger-fabric-mining/blockchain-network" folder.
- Here there is a "byfn.sh" script, we will use this to generate Network artifacts by running this command `sudo ./byfn.sh generate` .
- The above step generates certificates and keys for all the network entities.
- Then use the following command to start your Blockchain network `sudo ./byfn.sh up -a` .
- If everything goes well you will see that your network has been started in the Terminal.
- Only follow this step if you want to stop your Network `sudo ./byfn.sh down` .
-  Now run `sudo docker ps` command to see which Dockers are running, you will see that 2 organisations, certificate authority and orderer related nodes running.

For  detailed instructions, check out the official documentation of [Hyperledger facbric](https://hyperledger-fabric.readthedocs.io/en/latest/build_network.html).

### Adding Third Organisation to the Network
In this step we will use "eyfn.sh" file to add third organisation to our existing network.

- Type in the following command to add third organisation `sudo ./eyfn.sh up` .

If there are no errors when the above command is run, then the third organisation is successfully added to the network.

### Running Node application and testing RESTAPI
With the help of this Node application and the REST API calls built inside it, we can use our Blockchain Network. This is just an interface, we can do this in other methods as well.

- Go into "hyperledger-fabric-mining/blockchain-network/mining" folder.
- Run this command `sudo npm install` .
- Make sure all the packages get installed without errors.
- To run the node app use the following command `port=4000 node app` .
- Open a new terminal window to test RESTAPI, run `./testMinAPIs.sh` .

Make sure there are no errors occur before proceding to next step.

### Starting Frontend web application
To use the application we need a webpage interface, this was built with Angular 7.

- Go into "hyperledger-fabric-mining/blockchain-network/mining_registrar" folder.
- Here run `sudo npm install` command to install necessary packages for the angular app.
- Once the installation is done, run `ng serve -o` command, once the Angular files are compiled a webpage will be opened on "localhost:4200".

With this we will be able to interact with our Blockchain.

### Starting Blockchain Explorer
Blockchain Explorer is used to connect to the network and see comprehensive data about the transactions, blocks, chaincodes, etc, on the network.

- Follow the instructions in the [link](https://github.com/hyperledger/blockchain-explorer) to use the BlockChain explorer.

### Conclusion

With this a Blockchain network is deployed along with apps to monitor and interact with the Blockchain.
