# Base image
FROM node:20.9.0 AS development

# Create app directory
WORKDIR /code

RUN apt-get update
RUN apt-get install -y vim

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./code/package*.json ./

# Install app dependencies
RUN npm i -g @nestjs/cli
RUN npm install

# Bundle app source
COPY ./code .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
#EXPOSE 3000

# Start the server using the production build
CMD [ "npm", "run", "start:dev" ]
