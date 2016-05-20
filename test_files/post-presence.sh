#!/bin/bash

curl -v -X POST -H "Content-Type: application/json;charset=utf-8" \
-H "Authorization: Basic VpVw29xZVGWqVhNHgEcpYUitt05HSsixd7f09801" \
-d '@post-presence-test-data.json'  \
"http://localhost:3000/api/store/presence"
