#!/bin/bash
cd /home/ubuntu/eotd-backend
authbind --deep pm2 start /home/ubuntu/eotd-backend/dist/main.js