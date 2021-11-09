FROM nginxinc/nginx-unprivileged:1.21.3-alpine

LABEL org.opencontainers.image.source=https://github.com/navikt/fp-tilbake-frontend

ADD proxy.nginx /etc/nginx/conf.d/app.conf.template
ADD start-server.sh /start-server.sh

# FPSAK spesifikk
ENV APP_DIR="/app" \
	APP_PATH_PREFIX="/fptilbake" \
	APP_CALLBACK_PATH="/fptilbake/cb"

#FPSAK spesifkk
COPY dist /usr/share/nginx/html/fpsak

EXPOSE 9005

# using bash over sh for better signal-handling
CMD sh /start-server.sh
