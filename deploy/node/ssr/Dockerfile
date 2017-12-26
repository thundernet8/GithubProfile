# LTS 版本的NodeJS
FROM node:carbon
RUN mkdir -p /home

# 任何RUN命令均在此目录执行
WORKDIR /home

# 容器将监听8082端口
EXPOSE 8082

# 容器运行时直接启动App
CMD [ "npm", "run", "docker:ssr" ]