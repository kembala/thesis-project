#!/bin/bash

# Truffle includes solidity v0.4.15 in the included solc compiler, while view was introduced in 0.4.16
# Update solditiy version
# https://github.com/truffle-box/react-uport-box/issues/15

cd /usr/local/lib/node_modules/truffle
npm install solc@0.4.15