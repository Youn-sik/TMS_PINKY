#!/bin/bash
docker stack deploy -c php-nginx-core.yml ks
docker stack deploy -c php-nginx-ux.yml ks
docker stack deploy -c mariadb-galera-swam.yml ks
docker stack deploy -c mongodb.yml ks
docker stack deploy -c emqx.yml ks
docker stack deploy -c influxdb.yml ks

#docker stack deploy -c ./swarmpit/docker-compose.yml swarmpit