#!/bin/bash

set -e
rm -rf build
truffle compile
truffle migrate
truffle test
kill -9 $(lsof -t -i:8545)
