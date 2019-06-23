import React, { useState } from "react";

// HoC
import { makeStyles } from "@material-ui/core/styles";

// Material UI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: 120,
    height: 40
  },
  input: {
    display: "none"
  },
  error: {
    color: "red"
  },
  success: {
    color: "green"
  },
  label: {
    display: "flex",
    justifyContent: "flex-end"
  }
});

// 10MB max file size
const MAX_FILE_SIZE = 10485760;

const UploadButton = props => {
  const { classes: upstreamClasses, uploadDocument } = props;
  const classes = useStyles();

  const [status, setStatus] = useState({ error: null, success: false });
  const { error, success } = status;

  const onChange = ({ target: { files = [] } }) => {
    const [file = {}] = files || [];
    const { size = 0, type } = file || {};
    if (size > MAX_FILE_SIZE) {
      setStatus({ error: "File size is too large.", success: false });
      return;
    }
    if (type !== "image/jpeg" && type !== "image/png") {
      setStatus({ error: "Invalid file type.", success: false });
      return;
    }
    // TODO: Replace with ajax request
    uploadDocument(file)
      .then(({ data: { uploadDocument: { id } = {} } = {} }) => {
        if (id) {
          setStatus({ error: null, success: true });
          return;
        }
        setStatus({
          error: "There was an error uploading the file. Please try again.",
          success: false
        });
      })
      .catch(err => setStatus({ error: "Please try again.", success: false }));
  };

  return (
    <div className={upstreamClasses.root}>
      {error && (
        <Typography
          className={classes.error}
          variant="body2"
          data-test-id="UploadButton-error"
        >
          {error}
        </Typography>
      )}
      {success && (
        <Typography
          className={classes.success}
          variant="body2"
          data-test-id="UploadButton-success"
        >
          File uploaded successfully!
        </Typography>
      )}
      <input
        accept="image/jpeg,image/png"
        type="file"
        id="upload-input"
        className={classes.input}
        onChange={onChange}
        data-test-id="UploadButton-input"
      />
      <label htmlFor="upload-input" className={classes.label}>
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={classes.root}
          data-test-id="UploadButton-button"
        >
          Upload
        </Button>
      </label>
    </div>
  );
};

export default UploadButton;
