FROM oven/bun:latest

LABEL maintainer="Bysr <AmemiyaHikaru@BysrSystemDevelopment.com>"

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

ENV APP_SOURCE_DIR=/usr/local/src/owl-of-minerva

COPY --chown=bun bun.lock $APP_SOURCE_DIR/
COPY --chown=bun package.json $APP_SOURCE_DIR/

# Because Docker Compose uses a named volume for node_modules and named volumes are owned
# by root by default, we have to initially create node_modules here with correct owner.
# Without this bun cannot write packages into node_modules later, when running in a container.
RUN mkdir "$APP_SOURCE_DIR/node_modules" && chown bun "$APP_SOURCE_DIR/node_modules"
RUN apt-get update && apt-get install -y bash android-tools-adb

WORKDIR $APP_SOURCE_DIR
COPY --chown=bun . $APP_SOURCE_DIR

RUN bun add --global expo-cli

CMD ["bun", "run", "start"]
