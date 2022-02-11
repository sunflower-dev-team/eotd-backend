#!/bin/bash
cd /home/ubuntu/eotd-backend
pm2 stop /home/ubuntu/eotd-backend/dist/main.js 2> /dev/null || true
pm2 delete /home/ubuntu/eotd-backend/dist/main.js 2> /dev/null || true