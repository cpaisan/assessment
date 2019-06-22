import gql from "graphql-tag";

export default gql`
  mutation uploadDocument($file: Upload!) {
    uploadDocument(file: $file) {
      id
      name
      size
    }
  }
`;
