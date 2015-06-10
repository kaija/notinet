#!/bin/sh
curl -X POST -d 'fullName=kevin&email=kaija.chang@gmail.com&password=hello' http://localhost:3000/users/create

curl -X POST -d 'name=testgroup' http://localhost:3000/groups/create
