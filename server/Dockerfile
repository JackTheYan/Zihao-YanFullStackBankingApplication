# 指定node镜像
FROM node:12.22.12

# 指定容器内的工作路径
WORKDIR /usr/root/bad-bank


# 复制package.json和yarn.lock
COPY ["package.json", "./"]

# 安装
RUN npm install --registry=https://registry.npm.taobao.org

# 复制全部文件，源代码
COPY . .

# 这个容器暴露的端口
EXPOSE 8000

# 容器启动时执行的命令
ENTRYPOINT [ "npm", "start" ]