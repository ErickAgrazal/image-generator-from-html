FROM node:8.15-jessie
LABEL maintainer "Erick Agrazal erick@agrazal.com"

# Adding working directory
RUN mkdir /src
ADD ./src /src
VOLUME [ "/src" ]
WORKDIR /src

RUN  apt-get update && \
    apt-get install -y wget && \
    rm -rf /var/lib/apt/lists/* && \
    wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.3/wkhtmltox-0.12.3_linux-generic-amd64.tar.xz && \
    tar vxf wkhtmltox-0.12.3_linux-generic-amd64.tar.xz && \
    cp wkhtmltox/bin/wk* /usr/local/bin/ && \
    npm install

CMD ["node", "index.js"]