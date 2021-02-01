FROM node:14.15.4-alpine3.12 as build 
RUN echo "http://mirrors.ustc.edu.cn/alpine/v3.3/main/" > /etc/apk/repositories && apk update && apk add g++ make python
WORKDIR /app
COPY package*.json ./
RUN npm install --production --registry=https://registry.npm.taobao.org
FROM node:14.15.4-alpine3.12
RUN echo "http://mirrors.ustc.edu.cn/alpine/v3.3/main/" > /etc/apk/repositories && apk update && apk add bash
RUN apk add --no-cache tzdata \
    && ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone
ENV TZ Asia/Shanghai
WORKDIR /app
EXPOSE 3000
ENV NODE_ENV=production
COPY --from=build /app ./
COPY dist ./dist
CMD [ "npm", "start" ]