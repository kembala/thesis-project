# thesis-project

This is the example project of the bachelor thesis: "Managing digital contracts on blockchain platforms".
It consists of a react-app based on Truffle's [react-app](http://truffleframework.com/boxes/react).

## About

The  concept is an E-contract manager as a "smart-contract" on which the participants can establish agreement without the need for a trusted third-party (like lawyers and
courts). With this in-hand, prepared contract templates could be used and corporations would be able to offer contract creation processes via this platform. This would make
the contract creation process transparent and immutable. This creates a trustless system
which will simplify the creation process and the enforcement of the contracts.

This is the proof-of.concept implementation of such a platform in Solidity language for Ethereum blockchain with ReactJS based front-end.


## Prerequisites

On a fresh Ubuntu 18.04 install, we can set-up the necessary packages (Node, Truffle, Git) with the following commands:
```
    sudo apt install -y build-essential nodejs npm git
    sudo npm install -g truffle
```

## Installation

1. Clone repository from GitHub.
    ```
    git clone https://github.com/kemenesbalazs/thesis-project
    ```

2. Install the necessary dependencies in project directory.
    ```
    cd thesis-project
    npm install
    ```

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. Run the webpack server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run start
    ```
## Test

* Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```javascript
    // If inside the development console.
    test

    // If outside the development console..
    truffle test
    ```
## Build

8. To build the application for production, use the build command. A production build will be in the build_webpack folder.
    ```javascript
    npm run build
    ```
