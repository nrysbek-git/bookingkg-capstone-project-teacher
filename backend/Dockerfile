FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
USER node
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json server.js ./
EXPOSE 3000
CMD ["node", "server.js"]
