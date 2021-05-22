const fs = require('fs');
const path = require('path');
const { PubSub } = require('apollo-server');
const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const Link = require('./resolvers/Link');
const User = require('./resolvers/User');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');

const { getUserId } = require('./utils');

const pubsub = new PubSub();
const prisma = new PrismaClient();

const resolvers = {
  Link,
  User,
  Query,
  Mutation,
  Subscription
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null
    };
  }
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
