#!/bin/bash
cd /home/ubuntu/eotd-backend
nest build
authbind --deep pm2 start dist/main.js