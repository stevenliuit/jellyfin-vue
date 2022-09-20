## This dockerfile builds the client entirely in a Docker context

FROM node:16-alpine AS build

# Set build arguments
ARG DEFAULT_SERVERS
ARG HISTORY_ROUTER_MODE=1
ARG IS_STABLE=0

# Set environment variables
ENV DEFAULT_SERVERS=$DEFAULT_SERVERS
ENV HISTORY_ROUTER_MODE=$HISTORY_ROUTER_MODE
ENV IS_STABLE=$IS_STABLE

# Build dependencies required to build some node modules on ARM platforms. git is needed for fetching the latest commit
RUN apk add --no-cache git

# Set workdir
WORKDIR /app

# Copy files to workdir
COPY . .

RUN npm config set registry http://registry.npm.taobao.org/
# Install dependencies
RUN npm ci --no-audit

# Build client
RUN if [[ $IS_STABLE == "0" ]] ; then export COMMIT_HASH=$(git rev-parse HEAD) ; fi && npm run build

# Deploy built distribution to nginx
FROM nginx:alpine

COPY --from=build /app/frontend/dist/ /usr/share/nginx/html/
COPY --from=build /app/.docker/nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 6880

# Set labels
LABEL maintainer="Jellyfin Packaging Team - packaging@jellyfin.org"
LABEL org.opencontainers.image.source="https://github.com/stevenliuit/jellyfin-vue"
LABEL org.opencontainers.image.description="Commit: ${COMMIT_HASH} History router rode: ${HISTORY_ROUTER_MODE}"
