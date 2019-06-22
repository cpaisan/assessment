import React from "react";

// Material UI
import TextField from "@material-ui/core/TextField";

const Searchbar = props => {
  const { classes } = props;
  return (
    <TextField
      data-test-id="Searchbar-textField"
      placeholder="Search documents..."
      className={classes.root}
    />
  );
};

export default Searchbar;
