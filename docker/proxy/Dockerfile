# define tag for nginx
# NOTE: do not use latest tag.
# specify correct version you are using instead
# in this case, it is 1.23.1
ARG TAG=1.23.1-alpine

FROM nginx:${TAG}

# delete default configuration
RUN ["rm", "/etc/nginx/conf.d/default.conf"]

# replace with custom configuration
COPY nginx.conf /etc/nginx/templates/default.conf.template
