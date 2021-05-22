const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }
];
let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => {
      return links.find(item => item.id === args.id);
    }
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const index = links.findIndex(item => item.id === args.id);

      if (index !== -1) {
        links[index].url = args.url;
        links[index].description = args.description;

        return links[index];
      }
    },
    deleteLink: (parent, args) => {
      const index = links.findIndex(item => item.id === args.id);

      if (index !== -1) {
        const link = links[index];
        links.splice(index, 1);
        return link;
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
