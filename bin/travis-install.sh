#!/bin/bash
npm install
npm install -g ganache-cli truffle

# Upgrade truffles solidity version
pwd
cd /home/travis/.nvm/versions/node/v9.4.0/lib/node_modules/truffle
pwd
npm install solc@0.4.18
cd $TRAVIS_BUILD_DIR
pwd