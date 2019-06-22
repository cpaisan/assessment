import gql from "graphql-tag";

export default gql`
  mutation deleteDocument($id: ID!) {
    deleteDocument(id: $id)
  }
`;
