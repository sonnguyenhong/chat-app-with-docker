FROM node:16

EXPOSE 4000

WORKDIR /app

RUN npm i npm@latest -g

COPY package.json package-lock.json ./

COPY . .

CMD ["sh", "run.sh"]