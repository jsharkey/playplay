#!/bin/sh

cmd=`expr match "$0" '.*cmd_\(.*\).sh'`
curl -ks https://localhost:8076/${cmd} > /dev/null
