const neo4j = require("neo4j-driver");
const { inferSchema } = require("neo4j-graphql-js");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config();
const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

const schemaInferenceOptions = {
  alwaysIncludeRelationships: false
};

inferSchema(driver, schemaInferenceOptions).then(result => {
  fs.writeFile("schema11111.graphql", result.typeDefs, err => {
    if (err) throw err;
    console.log("Updated schema.graphql");
    process.exit(0);
  });
});