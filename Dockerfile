# From https://github.com/mhart/alpine-node
FROM gliderlabs/alpine:3.2

# ENV VERSION=v0.10.38 CMD=node DOMAIN=nodejs.org CFLAGS="-D__USE_MISC"
# ENV VERSION=v0.12.4 CMD=node DOMAIN=nodejs.org
ENV VERSION=v2.3.0 CMD=iojs DOMAIN=iojs.org

# For base builds
# ENV CONFIG_FLAGS="--without-npm" RM_DIRS=/usr/include
ENV CONFIG_FLAGS="--fully-static" DEL_PKGS="libgcc libstdc++" RM_DIRS=/usr/include

RUN apk-install curl make gcc g++ python linux-headers paxctl libgcc libstdc++ && \
  curl -sSL https://${DOMAIN}/dist/${VERSION}/${CMD}-${VERSION}.tar.gz | tar -xz && \
  cd /${CMD}-${VERSION} && \
  ./configure --prefix=/usr ${CONFIG_FLAGS} && \
  make -j$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) && \
  make install && \
  paxctl -cm /usr/bin/${CMD} && \
  cd / && \
  npm install -g npm && \
  apk del curl make gcc g++ python linux-headers paxctl ${DEL_PKGS} && \
  rm -rf /etc/ssl /${CMD}-${VERSION} ${RM_DIRS} \
    /usr/share/man /tmp/* /root/.npm /root/.node-gyp \
    /usr/lib/node_modules/npm/man /usr/lib/node_modules/npm/doc /usr/lib/node_modules/npm/html

WORKDIR /app
ADD . .
RUN npm install --production

# Cleanup
RUN apk del make gcc g++ python || : && \
    rm -rf /tmp/* /root/.npm /root/.node-gyp

EXPOSE 8000
CMD ["./bin/doplr.js", "radar"]
