#!/bin/bash
npm install
npm install -g ganache-cli truffle@4.1.5

pwd
cd $(npm root -g)/truffle
pwd
npm install solc@0.4.18
cd $TRAVIS_BUILD_DIR
pwd