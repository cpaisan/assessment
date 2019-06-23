import React from "react";

// Material UI
import TextField from "@material-ui/core/TextField";

// Utilities
import debounce from "lodash.debounce";

const documentSearch = debounce(
  (onSearch, searchText) => onSearch(searchText),
  500
);

const Searchbar = props => {
  const {
    classes,
    onChange: upstreamOnChange,
    searchText,
    setSearchText,
    searchError
  } = props;

  const onChange = ({ target: { value } }) => {
    setSearchText(value);
    documentSearch(upstreamOnChange, value);
  };

  return (
    <TextField
      data-test-id="Searchbar-textField"
      placeholder="Search documents..."
      className={classes.root}
      value={searchText}
      onChange={onChange}
      InputProps={{
        inputProps: {
          "data-test-id": "Searchbar-input"
        }
      }}
      error={searchError}
      helperText={
        searchError &&
        "There was an error while searching documents. Please try again."
      }
    />
  );
};

export default Searchbar;
