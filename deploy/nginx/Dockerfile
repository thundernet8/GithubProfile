FROM nginx:1.11.10

# 删除并添加自定义的Nginx.conf
RUN rm -v /etc/nginx/nginx.conf
ADD nginx.conf /etc/nginx/

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# 容器将监听80 443端口
EXPOSE 80 443

# 启动Nginx
CMD service nginx start