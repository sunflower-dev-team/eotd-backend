#!/bin/bash
cd /home/ubuntu/eotd-backend
sudo pm2 stop /home/ubuntu/eotd-backend/dist/main.js 2> /dev/null || true
sudo pm2 delete /home/ubuntu/eotd-backend/dist/main.js 2> /dev/null || true