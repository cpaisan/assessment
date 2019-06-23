import documents from "../fixtures/documents/index.json";

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

const uploadFile = () =>
  cy.fixture("/images/google.jpg").then(base64String => {
    cy.get('[data-test-id="UploadButton-input"]').then(el => {
      Cypress.Blob.base64StringToBlob(base64String, "image/jpeg").then(blob => {
        const file = new File([blob], "google.jpg", { type: "image/jpeg" });
        const dataTransfer = new DataTransfer();
        const input = el[0];
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        cy.wrap(el).trigger("change", { force: true });
      });
    });
  });

describe("Documents Page", () => {
  beforeEach(() => {
    cy._route({ url: "/documents" });
    cy.visit("/");
  });

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

  it("should search for documents", () => {
    cy._routeGraphQl("documents", "/bazSearch.json").as("searchDocuments");
    getTestId("Searchbar-input").type("baz");
    cy.wait("@searchDocuments");
    // Check for updated header
    getTestId("DocumentsPage-header").should("contain", "1 documents");
    // Check for updated total size
    getTestId("DocumentsPage-totalSize").should("contain", "Total size: 520kb");
    // There should only be one document card
    cy.get('[data-test-id*="DocumentCard-name"]').should("have.length", 1);
    // Check document card for correct values
    getTestId("DocumentCard-name-baz").should("contain", "baz");
    getTestId("DocumentCard-size-520").should("contain", "520kb");
    getTestId("DocumentCard-deleteButton-3").should("exist");
  });

  it("should upload a file", () => {
    cy._routeGraphQl("uploadDocument").as("uploadDocument");
    uploadFile();

    cy.wait("@uploadDocument");
    // Check for success message
    getTestId("UploadButton-success").should(
      "contain",
      "File uploaded successfully!"
    );
    // Check the documents page for correct updates
    getTestId("DocumentsPage-header").should("contain", "5 documents");
    getTestId("DocumentsPage-totalSize").should(
      "contain",
      "Total size: 1320kb"
    );
    cy.get('[data-test-id*="DocumentCard-root"]').should("have.length", 5);
    getTestId("DocumentCard-name-google.jpg").should("contain", "google.jpg");
    getTestId("DocumentCard-size-100").should("contain", "100kb");
    getTestId("DocumentCard-deleteButton-8").should("exist");
  });

  it("should handle a failed file upload", () => {
    cy._routeGraphQl("uploadDocument", "/failedUpload.json").as(
      "uploadDocument"
    );
    uploadFile();

    cy.wait("@uploadDocument");
    getTestId("UploadButton-error").should(
      "contain",
      "There was an error uploading the file. Please try again."
    );
  });

  it("should handle a server error during file upload", () => {
    uploadFile();
    getTestId("UploadButton-error").should("contain", "Please try again.");
  });
});
