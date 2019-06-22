import gql from "graphql-tag";

export default gql`
  query searchDocuments($search: String) {
    searchDocuments(search: $search) {
      id
      name
      size
    }
  }
`;
