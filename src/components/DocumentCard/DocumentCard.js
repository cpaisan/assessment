import React, { useState } from "react";

// HoC
import { makeStyles } from "@material-ui/core/styles";
import { graphql } from "react-apollo";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// GraphQL
import * as Mutations from "apollo/mutations";
import * as Queries from "apollo/queries";

const useStyles = makeStyles({
  content: {
    display: "grid",
    gridTemplateAreas: `
      "title title"
      "size  deleteButton"
      "error error"
    `,
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateRows: "content content",
    gridRowGap: "8px",
    padding: "10px !important"
  },
  title: {
    gridArea: "title"
  },
  size: {
    gridArea: "size",
    alignSelf: "center"
  },
  deleteButton: {
    gridArea: "deleteButton",
    maxWidth: 80,
    justifySelf: "end"
  },
  error: {
    fontSize: 10,
    color: "red",
    gridArea: "error"
  }
});
const DocumentCard = ({
  doc: { name = "", size, id } = {},
  deleteDocument
}) => {
  const classes = useStyles();
  const [error, setError] = useState(null);

  const handleDelete = () => {
    deleteDocument()
      .then(({ data: { deleteDocument } }) => {
        // Check for successful document deletion
        if (!deleteDocument) {
          setError(
            "An error occured while trying to delete this document. Please try again."
          );
        }
      })
      // Network error
      .catch(err => {
        setError("Please try again.");
      });
  };

  return (
    <Card data-test-id={`DocumentCard-root-${id}`}>
      <CardContent classes={{ root: classes.content }}>
        <Typography
          className={classes.title}
          data-test-id={`DocumentCard-name-${name}`}
        >
          {name}
        </Typography>
        <Typography
          className={classes.size}
          variant="body2"
          data-test-id={`DocumentCard-size-${size}`}
        >{`${size}kb`}</Typography>
        {error && <Typography className={classes.error}>{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          className={classes.deleteButton}
          onClick={handleDelete}
          data-test-id={`DocumentCard-deleteButton-${id}`}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

const deleteDocumentConfig = {
  props: ({ mutate, ownProps: { doc: { id } = {} } = {} }) => ({
    deleteDocument: () => mutate({ variables: { id } })
  }),
  options: ({ doc: { id } = {} } = {}) => ({
    update: (store, { data: { deleteDocument } }) => {
      // Remove the deleted document from the cache
      if (deleteDocument) {
        const data = store.readQuery({ query: Queries.DocumentsQuery });
        const updatedData = {
          ...data,
          documents: data.documents.filter(({ id: docId }) => docId !== id)
        };
        store.writeQuery({ query: Queries.DocumentsQuery, data: updatedData });
      }
    }
  })
};

export default graphql(Mutations.DeleteDocument, deleteDocumentConfig)(
  DocumentCard
);
