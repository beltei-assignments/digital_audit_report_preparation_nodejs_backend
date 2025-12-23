FROM node:18.12.0

EXPOSE 3001

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libxshmfence1 \
  xdg-utils \
  wget \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . /home/app

# remove husky install by removing prepare script & install dependencies
RUN npm pkg delete scripts.prepare && npm i

# install globaly required module for migrations
RUN npm i -g sequelize-cli

RUN chmod +x startup.sh

ENTRYPOINT [ "./startup.sh" ]
