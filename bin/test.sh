#!/bin/bash

ganache-cli --gasLimit 4712388 2> /dev/null 1> /dev/null &
echo 'ganace-cli started'
sleep 5 # to make sure ganache-cli is up and running before compiling
rm -rf build
echo 'build removed'
truffle compile
echo 'truffle compile done'
truffle migrate --reset --network development
echo 'migrate done'
truffle test
echo 'all tests done'
kill -9 $(lsof -t -i:8545)
echo 'ganache killed'