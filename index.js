const { makeAugmentedSchema } = require("neo4j-graphql-js");
const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();
const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env

const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql")).toString("utf-8");

const resolvers = {
  Business: {
    waitTime: (obj, args, context, info) => {
      const options = [0, 5, 10, 15, 30, 45];
      return options[Math.floor(Math.random() * options.length)];
    }
  }
};

const schema = makeAugmentedSchema({
  typeDefs,
  resolvers,
  config: {
    mutation: true,
    query: {
      exclude: ["MySecretType"]
    }
  }
})
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
)

const server = new ApolloServer({ 
  schema, 
  context: { driver, neo4jDatabase: "neo4j" } });

server.listen(4000, "localhost").then(({ url }) => {
  console.log("GraphQL API ready at: ", url);
});
