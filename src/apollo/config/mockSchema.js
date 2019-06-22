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
  }

  type Query {
    documents(search: String): [Document]!
  }

  type Mutation {
    uploadDocument(document: DocumentInput!): Document
    deleteDocument(id: ID!): Boolean!
  }
`;

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({
  schema,
  mocks: { ...QueryMocks, ...MutationMocks }
});

export default schema;
