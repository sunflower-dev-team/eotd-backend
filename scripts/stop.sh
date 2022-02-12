#!/bin/bash
cd /home/ubuntu/eotd-backend
sudo pm2 stop dist/main.js 2> /dev/null || true
sudo pm2 delete dist/main.js 2> /dev/null || true