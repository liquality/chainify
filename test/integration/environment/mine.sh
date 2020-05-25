apk add curl curl-dev

mine () { curl --basic -u bitcoin:local321 -X POST -d "{\"jsonrpc\": \"2.0\", \"id\": \"0\", \"method\": \"generate\", \"params\": [$1]}" http://${TARGET_HOST}:${TARGET_PORT} > /dev/null; }

mine 105 # Extra few blocks for some mature funds
