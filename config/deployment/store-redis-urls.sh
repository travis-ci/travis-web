#!/bin/sh
echo export ORG_PRODUCTION_REDIS_URL=`heroku config:get REDIS_URL -a travis-web-production-next`
echo export COM_PRODUCTION_REDIS_URL=`heroku config:get REDIS_URL -a travis-pro-web-production-next`
