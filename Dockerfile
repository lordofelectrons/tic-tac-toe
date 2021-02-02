FROM node:10
WORKDIR /app
COPY package*.json ./
COPY ./ /app
EXPOSE 8081
CMD ["npm", "start", "dev"]
