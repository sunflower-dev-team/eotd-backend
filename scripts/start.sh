#!/bin/bash
cd /home/ubuntu/eotd-backend
authbind --deep pm2 update
authbind --deep pm2 start dist/main.js