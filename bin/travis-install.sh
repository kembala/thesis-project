#!/bin/bash
npm install
npm install -g ganache-cli truffle

# Upgrade truffles solidity version
pwd
cd $(npm root -g)
pwd
npm install solc@0.4.18
cd $TRAVIS_BUILD_DIR
pwd