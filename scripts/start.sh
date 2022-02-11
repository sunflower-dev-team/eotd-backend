#!/bin/bash
cd /home/ubuntu/eotd-backend
ls
sudo authbind --deep pm2 start /home/ubuntu/eotd-backend/dist/main.js