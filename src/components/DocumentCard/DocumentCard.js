import React from "react";

// HoC
import { makeStyles } from "@material-ui/core/styles";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  content: {
    display: "grid",
    gridTemplateAreas: `
      "title title"
      "size  deleteButton"
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
  }
});
const DocumentCard = ({ doc: { name = "", size } = {} }) => {
  const classes = useStyles();
  return (
    <Card>
      <CardContent classes={{ root: classes.content }}>
        <Typography className={classes.title}>{name}</Typography>
        <Typography
          className={classes.size}
          variant="body2"
        >{`${size}kb`}</Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.deleteButton}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
