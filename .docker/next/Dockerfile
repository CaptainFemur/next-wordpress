FROM node:lts

RUN apt-get update -qq && \
    apt-get install -qy \
    nano

RUN chmod -R 777 /usr/src
RUN chown -R node:node /usr/src

WORKDIR /usr/src/app

EXPOSE 3000