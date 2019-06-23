import React, { useState, useEffect } from "react";

// HoC
import { makeStyles } from "@material-ui/core/styles";

// Material UI
import Typography from "@material-ui/core/Typography";

// Components
import Searchbar from "components/Searchbar";
import DocumentCard from "components/DocumentCard";
import UploadButton from "components/UploadButton";

// Utilities
import axios from "axios";
import apiUrl from "config/constants/apiServer";

const useStyles = makeStyles({
  root: {
    padding: 20,
    margin: "0 auto",
    maxWidth: 960,
    display: "grid",
    gridTemplateAreas: `
      "searchbar ......... uploadButton"
      "......... ......... ........."
      "header    header    totalSize"
      "documents documents documents"
    `,
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "60px 40px 60px auto"
  },
  searchbar: {
    gridArea: "searchbar",
    alignSelf: "center"
  },
  uploadButton: {
    gridArea: "uploadButton",

    justifySelf: "end",
    alignSelf: "center"
  },
  header: {
    gridArea: "header",
    display: "flex",
    alignItems: "center"
  },
  totalSize: {
    gridArea: "totalSize",
    alignSelf: "center",
    textAlign: "end"
  },
  documentContainer: {
    gridArea: "documents",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridGap: "15px"
  },
  error: {
    color: "red"
  },
  "@media (max-width: 600px)": {
    root: {
      padding: 15,
      gridTemplateAreas: `
        "uploadButton"
        "searchbar"
        "header"
        "totalSize"
        "documents"
      `,
      gridTemplateColumns: "1fr",
      gridTemplateRows: "50px 40px 40px 30px auto",
      gridColumnGap: "15px",
      gridRowGap: "8px",
      minWidth: 350
    },
    documentContainer: {
      gridArea: "documents",
      display: "grid",
      gridTemplateColumns: "1fr",
      gridGap: "15px"
    },
    totalSize: {
      gridArea: "totalSize",
      textAlign: "start",
      display: "flex",
      alignItems: "center"
    },
    header: {
      gridArea: "header",
      display: "flex",
      alignItems: "center"
    },
    uploadButton: {
      gridArea: "uploadButton",
      width: "100%"
    }
  }
});

/**
 * @param {arr[obj]} documents
 * @return {int}
 */
const getTotalDocumentsSize = documents =>
  documents.reduce((totalSize, { size = 0 }) => (totalSize += size), 0) || 0;

/**
 * @param {string, arr[obj], func}  id - document id to remove, documents - array of all documents,
 * setDocuments - to update the component state with the updated documents array
 * @return {arr[obj]} Updated document array with the corresponding document of the id removed
 */
const deleteDocument = (documents, setDocuments) => docId =>
  setDocuments(documents.filter(({ id }) => id !== docId));

const DocumentsPage = props => {
  // TODO: Replace onSearch with ajax request
  const { onSearch } = props;
  // State
  const [searchText, setSearchText] = useState("");
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    axios
      .get(`${apiUrl}/documents`)
      .then(({ data = [] }) => {
        setDocuments(data);
      })
      .catch(err => {
        setError(true);
      });
  }, []);

  const classes = useStyles();
  const totalSize = getTotalDocumentsSize(documents);

  return (
    <div className={classes.root}>
      <Searchbar
        classes={{ root: classes.searchbar }}
        searchText={searchText}
        setSearchText={setSearchText}
        onChange={onSearch}
      />
      <UploadButton classes={{ root: classes.uploadButton }} />
      <Typography
        className={classes.header}
        variant="h3"
        data-test-id="DocumentsPage-header"
      >{`${documents.length} documents`}</Typography>
      <Typography
        className={classes.totalSize}
        variant="h5"
        data-test-id="DocumentsPage-totalSize"
      >{`Total size: ${totalSize}kb`}</Typography>
      <div className={classes.documentContainer}>
        {error && (
          <Typography className={classes.error} variant="h4">
            There was an error loading the documents.
          </Typography>
        )}
        {documents.map(doc => (
          <DocumentCard
            doc={doc}
            key={doc.id}
            deleteDocument={deleteDocument(documents, setDocuments)}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentsPage;
