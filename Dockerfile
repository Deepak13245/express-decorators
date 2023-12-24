ARG WORKDIR=/app
FROM node:18.16.0 as build

ARG WORKDIR
WORKDIR $WORKDIR

RUN mkdir -p /root/.ssh && chmod 0700 /root/.ssh

COPY id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
COPY id_rsa.pub /root/.ssh/id_rsa.pub
RUN chmod 600 /root/.ssh/id_rsa.pub

RUN ssh-keyscan -t rsa github.com > /root/.ssh/known_hosts

COPY . .

RUN yarn install
RUN yarn build

RUN rm -rf /root/.ssh/


FROM node:18.16.0 as deps
ARG WORKDIR
WORKDIR $WORKDIR

RUN mkdir -p /root/.ssh && chmod 0700 /root/.ssh

COPY id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
COPY id_rsa.pub /root/.ssh/id_rsa.pub
RUN chmod 600 /root/.ssh/id_rsa.pub

RUN ssh-keyscan -t rsa github.com > /root/.ssh/known_hosts

COPY package.json .
COPY yarn.lock .
RUN yarn install --production
RUN rm -rf ~/.ssh

FROM node:18.16.0-alpine3.18
ARG WORKDIR
WORKDIR $WORKDIR

RUN apk --no-cache add ca-certificates

COPY --from=deps $WORKDIR/node_modules ./node_modules
COPY --from=build $WORKDIR/dist ./dist

ADD package.json .
ADD yarn.lock .

ENV TZ=Asia/Kolkata

EXPOSE 3000

CMD ["node", "dist/index.js"]
