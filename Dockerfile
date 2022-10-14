## Global Args

# define tag for base docker image
# NOTE: do not use latest tag.
# specify correct version you are using instead
# in this case, it is 18, which is not LTS version yet.
ARG TAG=18-slim

# define port where the app listen to
# defaults to 3000
ARG PORT=3000

# define user who will run the app
# defaults to `node`, default user provided by node image
# NOTE: it is recommended to run as non-root user for security reasons
ARG USER=node

# define user's home directory
ARG HOME=/home/${USER}

# define where to place codebase
ARG APP=${HOME}/app

# define absolute path to pnpm executable
ARG PNPM=${APP}/pnpm

##################################################
## Base Stage

FROM node:${TAG} AS base

## Args

# version of pnpm to install
ARG PNPM_VERSION=v7.13.4
ARG PNPM
ARG APP

## Working Directory Setup

# set up working directory,
WORKDIR ${APP}

## Install pnpm
ADD https://github.com/pnpm/pnpm/releases/download/${PNPM_VERSION}/pnpm-linuxstatic-x64 ${PNPM}

# then make the downloaded file executable
RUN chmod a+rx ${PNPM}

## Install Dependencies

# copy prisma schema
COPY prisma ./prisma/

# copy package.json dependency manifest
# and its corresponding lock file
COPY package.json pnpm-lock.yaml ./

# install production dependencies
RUN \
	${PNPM} \
	install \
	--frozen-lockfile \
	--prod

# generate a prisma client
# RUN ["./node_modules/.bin/prisma", "generate"]

##################################################
## Build Stage

# in build stage, copy all source files into container.
# this is also a stage for development purpose,
# where you can run unit tests, build prisma documentation, etc.
FROM node:${TAG} AS build

## Args

ARG PORT
ARG APP
ARG PNPM

# use defined port.
# NOTE: this is just documentation purpose.
# this value can be overridden at any time.
EXPOSE ${PORT}

## Working Directory Setup

# set up working directory,
WORKDIR ${APP}

# dump all files from base stage
COPY --from=base ${APP} ./

# install production dependencies
RUN ${PNPM} install --frozen-lockfile

# install all dependencies listed in lock file,
# including development dependencies
# RUN ${PNPM} install --frozen-lockfile --prod

## Build Application

# copy entire codebase to build
# NOTE: this is the most frequently repeated task.
# make sure all following tasks are as light as possible.
COPY \
	.node-version \
	.swcrc \
	jest.config.ts \
	nest-cli.json \
	tsconfig.build.json \
	tsconfig.json \
	./

# E2E test codes
COPY test ./test/

# source folder
COPY src ./src/

# build applications.
# it will use compiler like tsc and SWC internally.
# by leveraging SWC, it takes almost 50ms~100ms
RUN ${PNPM} build

## Run Application

# NOTE: do not use package managers like npm and pnpm here,
# to allow our app to listen to signals and gracefully shutdown itself.
CMD ["node", "dist/main"]

##################################################
# Bundle Stage

# remove unnecessary files
# and gather things together to make it easier to copy at once
FROM node:${TAG} AS bundle

# Args

ARG APP

# set up working directory,
WORKDIR ${APP}

## Pack Artifacts

# dump node_modules runtime libraries
COPY --from=base ${APP}/node_modules ./node_modules/

# dump built codebase
COPY --from=build ${APP}/dist ./dist/
COPY --from=build ${APP}/node_modules/@prisma/client ./node_modules/@prisma/client/

##################################################
# Production Stage

# use the same base image as build stage
FROM node:${TAG} AS run

## Args

ARG PORT
ARG USER
ARG HOME
ARG APP

# use defined port.
# NOTE: this is just documentation purpose.
# this value can be overridden at any time.
EXPOSE ${PORT}

# check whether the user is already exist or not.
# if not, create a new user without password
# then own home directory and its subdirectories, recursively
# then give owner read and write permissions
RUN id -u ${USER} || adduser ${USER} -D; \
	chown -R ${USER}:${USER} ${HOME}; \
	chmod -R u+rw ${HOME}

# log in as USER.
# from now on, all instructions will be happening
# inside this user's home directory.
USER ${USER}

# set up working directory,
WORKDIR ${APP}

# dump bundled codebase
COPY --from=bundle --chown=${USER}:${USER} ${APP} ./

## Run Application

# NOTE: do not use package managers like npm and pnpm here,
# to allow our app to listen to signals and gracefully shutdown itself.
CMD ["node", "dist/main"]
