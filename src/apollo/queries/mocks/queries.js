import { MockList } from "graphql-tools";

export default {
  Query: () => ({
    documents: () => new MockList(10)
  })
};
