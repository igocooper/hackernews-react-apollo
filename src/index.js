const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding')

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: (root, args, context, info) => {
            const links = context.db.query.links({},info);
            return links;
        }
    },
    Mutation: {
        post: (root, args, context, info) => {
            return context.db.mutation.createLink({
              data: {
                url: args.url,
                description: args.description,
              },
            }, info)
        },
        updateLink: (root, args, context, info) => {
            return context.db.mutation.updateLink({
                data: {
                    url: args.url,
                    description: args.description
                },
                where: {
                    id: args.id
                }
            }, info)
            
        },
        deleteLink: (root, args, context, info) => {
            return context.db.mutation.deleteLink({
                where: {
                    id: args.id
                }
            }, info);
        }
    },
    Link: {
        id: (root) => root.id,
        description: (root) => root.description,
        url: (root) => root.url
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
          typeDefs: 'src/generated/prisma.graphql',
          endpoint: 'https://eu1.prisma.sh/public-cottonhair-980/hackernews-node/dev',
          secret: 'graphQLIsCool',
          debug: true,
        }),
      }),
});

server.start( () => console.log(`Server is running on http://localhost:4000`));