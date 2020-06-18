#!/bin/sh

docker run -dit -p 3000:3000 -e DEBUG="stocktrace-web:*" stocktrace:latest
