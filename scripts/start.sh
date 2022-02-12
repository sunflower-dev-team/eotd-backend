#!/bin/bash
cd /home/ubuntu/eotd-backend
sudo authbind --deep pm2 start dist/main.js