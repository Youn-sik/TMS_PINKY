#FROM node:dubnium-alpine
FROM ubuntu:latest
#COPY src src/
#COPY package.json .
#COPY pm2.json .

RUN apt-get update
RUN apt-get -y install curl
RUN apt-get -y install wget
RUN apt-get -y install mysql-client

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get -y install nodejs
RUN npm cache clean --force
RUN npm install -g n
RUN n stable



ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

RUN npm install request async-mqtt mqtt image-info influx socket.io mysql mysql2 node.date-time cron mongodb md5 date-utils mongoose bull mariadb mkdirp --save

RUN npm install pm2 -g
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:max_size 1M
RUN npm install log4js --save
RUN npm install node-datetime --save
RUN npm install mkdirp --save
RUN npm install face-api.js --save
RUN npm install canvas --save
RUN npm install async-json --save
RUN npm install node-fetch --save

EXPOSE 1883

CMD ["pm2-runtime", "start", "mqtt.js"]
CMD ["pm2-runtime", "start", "mqtt_interval.js"]
