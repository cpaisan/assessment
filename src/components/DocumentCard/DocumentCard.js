import React, { useState } from "react";

// HoC
import { makeStyles } from "@material-ui/core/styles";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// Utilities
import axios from "axios";
import apiUrl from "config/constants/apiServer";

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
  },
  root: {
    height: "max-content"
  }
});

/**
 * @async
 * @param {string, func, func}
   id - id of deleted document
   setError - function to update error state
   deleteCallback - function in parent component that removes deleted
   document from state
 * @return {undefined}
 */
const handleDelete = async (id, setError, deleteCallback) => {
  try {
    const { status } = await axios.delete(`${apiUrl}/documents/${id}`);
    // Check for successful document deletion
    if (status === 200) {
      deleteCallback && deleteCallback(id);
    }
  } catch ({ response }) {
    const { status } = response || {};
    if (status > 400 && status < 500) {
      setError(
        "An error occured while trying to delete this document. Please try again."
      );
      return;
    }
    // Server error
    if (status >= 500) {
      setError("Please try again.");
      return;
    }
  }
};

const DocumentCard = ({
  doc: { name = "", size, id } = {},
  deleteDocument
}) => {
  const classes = useStyles();
  const [error, setError] = useState(null);

  return (
    <Card
      data-test-id={`DocumentCard-root-${id}`}
      classes={{ root: classes.root }}
    >
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
        {error && (
          <Typography
            className={classes.error}
            data-test-id={`DocumentCard-error-${id}`}
          >
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          className={classes.deleteButton}
          onClick={() => handleDelete(id, setError, deleteDocument)}
          data-test-id={`DocumentCard-deleteButton-${id}`}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
