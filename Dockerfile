FROM node:20
WORKDIR /the/workdir/path
ADD . .
RUN npm install
RUN npn run build api
CMD ["node", "./dist/main.js"]