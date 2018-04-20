const { GraphQLServer } = require('graphql-yoga');

// mock data
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }];

let idCount = links.length;

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (root, args) => {
            const link = links.find(link => link.id === args.id);
            return link;
        }
    },
    Mutation: {
        post: (root, args) => {
            const link = {
                id : `link-${idCount++}`,
                description: args.description,
                url: args.url
            };
            links.push(link);
            return link
        },
        updateLink: (root, args) => {
            const link = links.find( link => link.id === args.id);
            link.description = args.description || link.description;
            link.url = args.url || link.url;
            return link;
        },
        deleteLink: (root, args) => {
            let deletedLink, deleteIndex;
            links.forEach((link, index) => {
                if (link.id === args.id) {
                    deletedLink = link;    
                } 
            });

            const link = links.splice(deleteIndex, 1);

            // links = links.filter(link => link.id !== args.id);
           
            return deletedLink;
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
    resolvers
});

server.start( () => console.log(`Server is running on http://localhost:4000`));