import { mockDocuments } from "./documentsQuery";

export default {
  Query: () => ({
    documents: (_, { search = "" }) => {
      return mockDocuments.filter(({ name }) =>
        name.toLowerCase().includes((search || "").toLowerCase())
      );
    }
  })
};
