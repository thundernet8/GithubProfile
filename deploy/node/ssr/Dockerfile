# TLS 版本的NodeJS
FROM node:boron
RUN mkdir -p /home

# 任何RUN命令均在此目录执行
WORKDIR /home

COPY . /home

RUN npm install

RUN npm run build:all

# 容器将监听8082端口
EXPOSE 8082

# 容器运行时直接启动App
CMD [ "npm", "run", "start:ssr" ]