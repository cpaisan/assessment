import gql from "graphql-tag";

export default gql`
  query documents($search: String) {
    documents(search: $search) {
      id
      name
      size
    }
  }
`;
