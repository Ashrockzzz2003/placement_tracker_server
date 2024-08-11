FROM node:20-alpine 

WORKDIR /placement_tracker_server

COPY . .

RUN \
    npm ci && \
    npm cache clean --force 

EXPOSE 5000/tcp

CMD npm start