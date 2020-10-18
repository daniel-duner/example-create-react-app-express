#!/bin/bash
touch credentials.json
curl -X POST 'https://api-testbed.scrive.com/api/v2/getpersonaltoken' \
  --data-urlencode "email=$SCRIVE_USERNAME" \
  --data-urlencode "password=$SCRIVE_PASSWORD"