#!/bin/bash
cd /home/ubuntu/eotd-backend
ls
authbind --deep pm2 start /home/ubuntu/eotd-backend/dist/main.js