FROM  node:12.22.12

# 复制package.json
COPY ["package.json", "./"]

RUN npm install -g cross-env 

RUN npm install --registry=https://registry.npm.taobao.org

RUN npm run build 