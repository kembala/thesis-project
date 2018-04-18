#!/bin/bash
npm install
npm install -g ganache-cli truffle

# Upgrade truffles solidity version
cd node_modules/truffle
npm install solc@0.4.18
cd $TRAVIS_BUILD_DIR