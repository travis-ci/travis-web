#!/bin/bash
echo "Rebuilding web"
cp -rT /app /build
if [ ! -z AIDA_URL ]; then
   echo "Replacing aida.js with $AIDA_URL"
   curl -o /build/node_modules/asktravis/dist/aida.js $AIDA_URL
   curl -o /build/node_modules/asktravis/dist/aida.js.map $AIDA_URL.map || true
fi
cd /build && ember build --environment=${ENV:-production}
