import React from "react";

// Material UI
import Button from "@material-ui/core/Button";

const UploadButton = props => {
  const { classes } = props;
  return (
    <Button className={classes.root} variant="contained" color="primary">
      Upload
    </Button>
  );
};

export default UploadButton;
