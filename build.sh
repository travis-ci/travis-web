#!/bin/bash

# Check if AIDA_URL is not empty
echo "AIDA_URL: $AIDA_URL"
if [ -n "$AIDA_URL" ]; then
  curl -o /app/node_modules/asktravis/dist/aida.js "$AIDA_URL"
  curl -o /app/node_modules/asktravis/dist/aida.js.map "$AIDA_URL.map"
fi

# Always build the Ember application
ember build --environment=${ENV:-production}
