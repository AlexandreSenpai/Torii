FROM node:14-slim
WORKDIR /app

COPY package.json tsconfig.json /app/
COPY . .
RUN npm install & npm install -g typescript

RUN tsc -p .
RUN mkdir -p /app/dist/src/infra/adapters/database/implementations/documentdb/certificates

WORKDIR /app/dist/src/infra/adapters/database/implementations/documentdb/certificates

RUN apt-get update -y
RUN apt-get install wget -y
RUN wget -O rds-combined-ca-bundle.pem https://truststore.pki.rds.amazonaws.com/us-east-1/us-east-1-bundle.pem

WORKDIR /app

CMD [ "node", "/app/dist/index.js" ]
