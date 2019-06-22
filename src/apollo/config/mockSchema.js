import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import QueryMocks from "apollo/queries/mocks";
import MutationMocks from "apollo/mutations/mocks";

const typeDefs = `
  type Document {
    id: ID
    name: String!
    size: Int!
  }

  input DocumentInput {
    name: String!
    size: Int!
    type: String!
  }

  type Query {
    documents(search: String): [Document]!
  }

  type Mutation {
    uploadDocument(file: Upload!): Document
    deleteDocument(id: ID!): Boolean!
  }

  scalar Upload
`;

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({
  schema,
  mocks: { ...QueryMocks, ...MutationMocks }
});

export default schema;
