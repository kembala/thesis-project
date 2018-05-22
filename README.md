# thesis-project
![Travis Badge](https://travis-ci.com/kemenesbalazs/thesis-project.svg?token=zk4SdsUUbg2RExKGHKy2&branch=master)

This is the example project of the bachelor thesis: "Managing digital contracts on blockchain platforms".
It consists of a react-app based on Truffle's [react-app](http://truffleframework.com/boxes/react).

## About

The  concept is an E-contract manager as a "smart-contract" on which the participants can establish agreement without the need for a trusted third-party (like lawyers and
courts). With this in-hand, prepared contract templates could be used and corporations would be able to offer contract creation processes via this platform. This would make
the contract creation process transparent and immutable. This creates a trustless system
which will simplify the creation process and the enforcement of the contracts.

This is the proof-of.concept implementation of such a platform in Solidity language for Ethereum blockchain with ReactJS based front-end.

## Installation

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Install the necessary dependencies in project directory.
    ```javascript
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

* Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors.
    ```javascript
    // Run Jest outside of the development console for front-end component tests.
    npm run test
    ```
## Build

8. To build the application for production, use the build command. A production build will be in the build_webpack folder.
    ```javascript
    npm run build
    ```
