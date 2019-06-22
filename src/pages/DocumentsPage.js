import React from "react";

// HoC
import { makeStyles } from "@material-ui/core/styles";
import { graphql } from "react-apollo";

// Material UI
import Typography from "@material-ui/core/Typography";

// Components
import Searchbar from "components/Searchbar";
import DocumentCard from "components/DocumentCard";
import UploadButton from "components/UploadButton";

// GraphQL
import * as Queries from "apollo/queries";

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
    gridTemplateRows: "50px 40px 60px auto"
  },
  searchbar: {
    gridArea: "searchbar",
    alignSelf: "center"
  },
  uploadButton: {
    gridArea: "uploadButton",
    width: 120,
    height: 40,
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

const DocumentsPage = props => {
  const { documents = [] } = props;
  const classes = useStyles();
  const totalSize = getTotalDocumentsSize(documents);

  return (
    <div className={classes.root}>
      <Searchbar classes={{ root: classes.searchbar }} />
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
        {documents.map(doc => <DocumentCard doc={doc} key={doc.id} />)}
      </div>
    </div>
  );
};

const documentsQueryConfig = {
  props: ({ data: { documents = [] } }) => ({ documents })
};

export default graphql(Queries.DocumentsQuery, documentsQueryConfig)(
  DocumentsPage
);
