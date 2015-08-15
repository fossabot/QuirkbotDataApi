FROM	node

# Bundle app source
ADD ./src /src
WORKDIR /src

# Install app dependencies
RUN npm install

EXPOSE  1337

CMD ["node", "app.js"]