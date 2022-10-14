FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn
RUN npx tsc
EXPOSE 3000
CMD ["yarn", "start"]