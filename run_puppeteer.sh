#!/usr/bin/env bash

readonly USAGE="Usage: run_puppeteer.sh yourfile.js"

if [ -z "$1" ]
then
  echo "File not specified."
  echo $USAGE
  exit 0
fi

echo "Running $1 in Puppeteer..."

file=`cat $1`

# set -x # debug on
docker run -i --init --rm --cap-add=SYS_ADMIN \
  --name puppeteer-chrome puppeteer-chrome-linux \
  node -e "$file"
# set +x # debug off


#  docker run -i --init --rm --cap-add=SYS_ADMIN \
#    --name puppeteer-chrome puppeteer-chrome-linux \
#    node -e "`cat ./build/bundle.js`"