import gql from "graphql-tag";

export default gql`
  query documents {
    documents {
      id
      name
      size
    }
  }
`;
