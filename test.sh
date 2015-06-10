#!/bin/sh
echo "Stop all service"
killall node
sleep 1
echo "Delete database"
make clean
sleep 1
echo "Start service"
npm start &
sleep 5
echo "Start test"
make test
