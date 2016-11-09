export ORG_PRODUCTION_REDIS_URL=`heroku config:get REDIS_URL -a travis-web-production-next`
export COM_PRODUCTION_REDIS_URL=`heroku config:get REDIS_URL -a travis-pro-web-production-next`

echo $ORG_PRODUCTION_REDIS_URL | cut -c1-8
echo $COM_PRODUCTION_REDIS_URL | cut -c1-8
