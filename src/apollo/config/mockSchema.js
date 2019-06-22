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
    documents: [Document]!
  }

  type Mutation {
    uploadDocument(document: DocumentInput!): Document
    deleteDocument(documentId: ID!): Boolean!
    searchDocuments(search: String): [Document]!
  }
`;

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({
  schema,
  mocks: { ...QueryMocks, ...MutationMocks }
});

export default schema;
