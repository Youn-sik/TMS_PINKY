#!/bin/bash
echo "실행 파일 재시작 시간: $(date +%Y)년 $(date +%m)월 $(date +%d)일 $(date +%H)시 $(date +%M)분 $(date +%S)초";
#pm2 restart /var/www/backend/index.js;
#pm2 restart /var/www/docker/mqtt.js;
#pm2 restart /var/www/backend/face_cut/access_realtime.py;
pm2 restart all;
