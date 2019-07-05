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
        "searchbar"
        "header"
        "totalSize"
        "documents"
        "uploadButton"
      `,
      gridTemplateColumns: "1fr",
      gridTemplateRows: " 40px 40px 30px calc(100vh - 230px) 50px",
      gridColumnGap: "15px",
      gridRowGap: "8px",
      minWidth: 350
    },
    documentContainer: {
      gridArea: "documents",
      display: "grid",
      gridTemplateColumns: "1fr",
      gridGap: "15px",
      overflowY: "auto"
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
 * @param {arr[obj]}
   documents - array of document objects
 * @return {int}
   total size of documents
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

/**
 * @async
 * @param {func, string}
   setDocuments - update documents after search result is received
   searchText - string to search document names by
 * @return {Promise} returns axios promise
 */
const onSearch = (setDocuments, setSearchError) => async searchText => {
  const getUrl = `${apiUrl}/documents?name=${searchText}`;
  try {
    const { status, data = [] } = await axios.get(getUrl);
    if (status === 200) {
      setDocuments(data);
      setSearchError(false);
    }
  } catch (err) {
    setSearchError(true);
  }
};

/**
 * @param {arr[obj], func, obj}
    documents - array of documents
    setDocuments - function to handle state update
    newDoc - new document object
 * @return {int}
 */
const handleUploadSuccess = (documents, setDocuments) => newDoc =>
  setDocuments([newDoc, ...documents]);

/**
   * @async
   * @param {func, func}
     setDocuments - function to update documents state
     setError - function to update error state
   * @return {undefined}
   */
const fetchData = async (setDocuments, setError) => {
  try {
    const { data } = await axios.get(`${apiUrl}/documents`);
    setDocuments(data);
  } catch (err) {
    setError(true);
  }
};

const DocumentsPage = props => {
  // State
  const [searchText, setSearchText] = useState("");
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(false);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    fetchData(setDocuments, setError);
  }, []);

  const classes = useStyles();
  const totalSize = getTotalDocumentsSize(documents);

  return (
    <div className={classes.root}>
      <Searchbar
        classes={{ root: classes.searchbar }}
        searchText={searchText}
        setSearchText={setSearchText}
        onChange={onSearch(setDocuments, setSearchError)}
        searchError={searchError}
      />
      <UploadButton
        classes={{ root: classes.uploadButton }}
        handleUploadSuccess={handleUploadSuccess(documents, setDocuments)}
      />
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
