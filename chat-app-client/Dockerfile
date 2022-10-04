FROM node:17

EXPOSE 3000

WORKDIR /src

RUN npm i npm@latest -g

COPY package.json package-lock.json ./

RUN npm install 

RUN npm rebuild node-sass

COPY . .

CMD ["npm", "start"]