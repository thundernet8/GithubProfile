# TLS 版本的NodeJS
FROM node:boron

VOLUME ["/home"]

# 任何RUN命令均在此目录执行
WORKDIR /home

RUN npm install

# 容器将监听8000和8999端口
EXPOSE 8000
EXPOSE 8999

# 容器运行时直接启动App
CMD [ "npm", "run", "start:api" ]