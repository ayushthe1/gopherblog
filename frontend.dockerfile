FROM node:alpine as build
WORKDIR /app

COPY ./react-frontend/package.json ./react-frontend/package-lock.json ./
RUN npm i --force
COPY ./react-frontend ./
RUN npm run build
RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "4000"]

