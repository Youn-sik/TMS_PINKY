FROM ubuntu:18.04

ENV DEBIAN_FRONTEND noninteractive   
RUN apt-get update
RUN apt-get -y install apt-utils 

RUN apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common wget
RUN curl -fsSL https://repos.emqx.io/gpg.pub |  apt-key add -
RUN apt-key fingerprint 3E640D53
RUN add-apt-repository \
    "deb [arch=amd64] https://repos.emqx.io/emqx-ce/deb/ubuntu/ \
    $(lsb_release -cs) \
    stable"
RUN apt-get update
RUN apt-get install -y emqx=3.1.0

EXPOSE 1883 8080 8083 8084 8883 11883 18083 4369 5369 6369

CMD ["emqx start"]
