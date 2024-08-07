#!/bin/bash

# Check if AIDA_URL is not empty
# this is not working for some reason AIDA_URL is not being recognized
printenv
if [ -n "$AIDA_URL" ]; then
  echo "Downloading AIDA"
  curl -o /app/node_modules/asktravis/dist/aida.js "$AIDA_URL"
  curl -o /app/node_modules/asktravis/dist/aida.js.map "$AIDA_URL.map"
fi

# DO NOT RUN ON PRODUCTION
# curl -o /app/node_modules/asktravis/dist/aida.js https://aida-lib-dev.idera.com/version/latest/aida.js
# curl -o /app/node_modules/asktravis/dist/aida.js.map https://aida-lib-dev.idera.com/version/latest/aida.js.map

# Always build the Ember application
ember build --environment=${ENV:-production}
