import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import QueryMocks from "apollo/queries/mocks";
import MutationMocks from "apollo/mutations/mocks";

const typeDefs = `
  type File {
    name: String!
    size: Int!
  }
`;

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({
  schema,
  mocks: { ...QueryMocks, ...MutationMocks }
});

export default schema;
