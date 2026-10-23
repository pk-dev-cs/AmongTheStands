FROM nginx:stable-alpine

ENV PORT=8080
COPY dist/ /usr/share/nginx/html/
COPY deploy/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 8080
