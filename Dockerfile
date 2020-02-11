FROM node:12.4.0

LABEL maintainer="Bysr <AmemiyaHikaru@BysrSystemDevelopment.com>"

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

ENV APP_SOURCE_DIR=/usr/local/src/owl-of-minerva

COPY --chown=node package-lock.json $APP_SOURCE_DIR/
COPY --chown=node package.json $APP_SOURCE_DIR/

# Because Docker Compose uses a named volume for node_modules and named volumes are owned
# by root by default, we have to initially create node_modules here with correct owner.
# Without this NPM cannot write packages into node_modules later, when running in a container.
RUN mkdir "$APP_SOURCE_DIR/node_modules" && chown node "$APP_SOURCE_DIR/node_modules"
RUN apt-get update && apt-get install bash && apt-get install android-tools-adb -y

WORKDIR $APP_SOURCE_DIR
COPY --chown=node . $APP_SOURCE_DIR

RUN npm install -g expo-cli --unsafe-perm

CMD ["npm", "start"]
