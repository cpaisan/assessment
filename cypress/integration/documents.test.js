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

  const {
    data: { documents = [] }
  } = documentsData;

  it("should load documents", () => {
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

  it("should delete a document", () => {
    cy._routeGraphQl("deleteDocument").as("deleteDocument");
    getTestId("DocumentCard-deleteButton-4").click();
    cy.wait("@deleteDocument");
    // Check for updated header
    getTestId("DocumentsPage-header").should(
      "contain",
      `${documents.length - 1} documents`
    );
    // Check for updated total size
    getTestId("DocumentsPage-totalSize").should(
      "contain",
      `Total size: ${getTotalDocumentsSize(documents.slice(0, 3))}kb`
    );

    // Check updated document cards
    documents.slice(0, 3).forEach(({ id, name, size }) => {
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

  it("should handle errors for failed deletions", () => {
    cy._routeGraphQl("deleteDocument", "/failure.json").as("deleteDocument");
    getTestId("DocumentCard-deleteButton-4").click();
    cy.wait("@deleteDocument");
    getTestId("DocumentCard-error-4").should(
      "contain",
      "An error occured while trying to delete this document. Please try again."
    );
  });

  it("should handle a network error", () => {
    getTestId("DocumentCard-deleteButton-4").click();
    getTestId("DocumentCard-error-4").should("contain", "Please try again.");
  });
});
