FROM --platform=linux/amd64 node:20-alpine as build
ARG BACKEND_URL
ENV BACKEND_URL $BACKEND_URL
WORKDIR /app
COPY ./app/package*.json /app/
RUN npm install -g ionic
RUN npm install
COPY ./app /app/
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run config
RUN ionic build --prod
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./security-headers.conf /etc/nginx/security-headers.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/www/ /usr/share/nginx/html/
