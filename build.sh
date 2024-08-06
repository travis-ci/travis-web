if [ ! -z AIDA_URL ]; then
  curl -o /app/node_modules/asktravis/dist/aida.js $AIDA_URL
  curl -o /app/node_modules/asktravis/dist/aida.js.map $AIDA_URL.map
fi
ember build --environment=${ENV:-production}
