#!/bin/sh
#curl -X POST --digest -D header.txt  --user 'kaija.chang.co@gmail.com:test' http://localhost:3000/login
curl -X POST --digest -D header.txt  --user 'abc@gmail.com:test' http://localhost:3000/login
cookie=`cat header.txt | grep set-cookie | sed -n 2p | cut -d ';' -f 1 | cut -d '=' -f 2`
echo "\nRequest via connect.sid=$cookie\n"
curl -v --cookie "connect.sid=$cookie" http://localhost:3000/users/get
