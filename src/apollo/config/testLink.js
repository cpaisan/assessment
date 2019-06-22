import { createHttpLink } from "apollo-link-http";
import unfetch from "unfetch";

const fetchMock = (path, options) => {
  const body = JSON.parse(options.body);
  const { operationName } = body;
  const pathWithOperationName = `${path}/${operationName}`;
  return unfetch(pathWithOperationName, options);
};

const link = createHttpLink({
  uri: `http://localhost:3000/graphql`,
  fetch: fetchMock
});

export default link;
