// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    message: String
  }
`;

const resolvers = {
  Query: {
    message: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({
          secret: "fnAEAHLXkJACBU2Rat9sSNEplPxqRcWucqnOI-zc",
        });
        let result = await client.query(
          q.Get(q.Ref(q.Collection("CrudData"), "288339664245359111"))
        );

        return result.data.message;
      } catch (err) {
        return err.toString();
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler();
// module.exports = { handler };
