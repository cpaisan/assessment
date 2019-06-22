import documentsData from "../fixtures/graphql/documents/index.json";

/**
 * @param {string} testId
 * @return {node}
 */
const getTestId = testId => cy.get(`[data-test-id="${testId}"]`);

/**
 * @param {arr[obj]} documents
 * @return {int}
 */
const getTotalDocumentsSize = documents =>
  documents.reduce((totalSize, { size = 0 }) => (totalSize += size), 0) || 0;

describe("Documents Page", () => {
  beforeEach(() => {
    cy._routeGraphQl("/documents");
    cy.visit("/");
  });

  it("should load documents", () => {
    const {
      data: { documents = [] }
    } = documentsData;
    // Check for correct header
    getTestId("DocumentsPage-header").should(
      "contain",
      `${documents.length} documents`
    );
    // Check for correct total size
    getTestId("DocumentsPage-totalSize").should(
      "contain",
      `Total size: ${getTotalDocumentsSize(documents)}kb`
    );
    // Check that the document cards rendered
    documents.forEach(({ id, name, size }) => {
      getTestId(`DocumentCard-root-${id}`)
        .should("exist")
        .within(() => {
          // Check for document name
          getTestId(`DocumentCard-name-${name}`).should("contain", name);
          // Check for document size
          getTestId(`DocumentCard-size-${size}`).should("contain", `${size}kb`);
          // Check for delete button
          getTestId(`DocumentCard-deleteButton-${id}`).should("exist");
        });
    });
  });
});
