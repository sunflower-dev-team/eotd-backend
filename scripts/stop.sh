#!/bin/bash
cd /home/ubuntu/eotd-backend
pm2 stop ./dist/main.js
pm2 delete ./dist/main.js