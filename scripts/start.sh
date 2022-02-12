#!/bin/bash
cd /home/ubuntu/eotd-backend
sudo authbind --deep pm2 start /home/ubuntu/eotd-backend/dist/main.js