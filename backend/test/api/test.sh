#!/bin/bash -x

[ -z ${1} ] && echo "${0} error: expected executable name" && exit 0;

# name of executable - first arg
EXEC=${1};

./${EXEC} &

requests_per_client=100000
num_clients=100

sleep 1 # for some reason it doesnt work without a sleep :-(
# the kill command seems to run before the test bench can run, but this sleep
# here removes this issue???

ab -n ${requests_per_client} -c ${num_clients} -k \
   -p "./test/api/api-test-data.json" \
   "http://127.0.0.1:4000/send-mail-test"

# kill spawned bg task
pkill ${EXEC};
