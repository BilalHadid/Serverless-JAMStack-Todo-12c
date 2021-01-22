// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    message: [Todo!]
  }
  type Todo {
    id: ID!
    task: String!
  }
  type Mutation {
    create(task: String!): Todo
    removeTodo(id: ID!): Todo
  }
`;

const resolvers = {
  Query: {
    message: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({
          secret: "fnAEAHLXkJACBU2Rat9sSNEplPxqRcWucqnOI-zc",
        });
        // let result = await client.query(
        //   q.Get(q.Ref(q.Collection("CrudData"), "288339664245359111"))
        // );
        var result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("CrudData"))),
            q.Lambda((x) => q.Get(x))
          )
        );
        return result.data.map((d) => {
          return {
            id: d.ref.id,
            task: d.data.message,
          };
        });
      } catch (err) {
        return err.toString();
      }
    },
  },
  Mutation: {
    create: async (_, args) => {
      try {
        var client = new faunadb.Client({
          secret: "fnAEAHLXkJACBU2Rat9sSNEplPxqRcWucqnOI-zc",
        });
        const result = await client.query(
          q.Create(q.Collection("CrudData"), {
            data: args,
          })
        );
        return result.data;
      } catch (error) {
        console.log(error);
      }
    },
    removeTodo: async (_, args) => {
      try {
        var result = await client.query(
          q.Delete(q.Ref(q.Collection("CrudData"), args.id))
        );
        console.log("Document Deleted : ", result.ref.id);
        return result.ref.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler();
// module.exports = { handler };
