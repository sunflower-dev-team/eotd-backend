#!/bin/bash
cd /home/ubuntu/eotd-backend
cat .env.prod
authbind --deep pm2 start dist/main.js