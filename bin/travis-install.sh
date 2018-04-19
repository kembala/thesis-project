#!/bin/bash
npm install
npm install -g ganache-cli truffle@4.1.5

echo 'Local truffle'
npm list | grep truffle
echo 'Global truffle'
npm list -g | grep truffle