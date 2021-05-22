const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (parent, args, context) => {
      return context.prisma.link.findMany();
    }
    // link: (parent, args, context) => {
    //   return links.find(item => item.id === args.id);
    // }
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description
        }
      });
      return newLink;
    }
    // updateLink: (parent, args) => {
    //   const index = links.findIndex(item => item.id === args.id);

    //   if (index !== -1) {
    //     links[index].url = args.url;
    //     links[index].description = args.description;

    //     return links[index];
    //   }
    // },
    // deleteLink: (parent, args) => {
    //   const index = links.findIndex(item => item.id === args.id);

    //   if (index !== -1) {
    //     const link = links[index];
    //     links.splice(index, 1);
    //     return link;
    //   }
    // }
  }
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: {
    prisma
  }
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
