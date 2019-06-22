import React from "react";

// Material UI
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const DocumentCard = ({ doc: { name = "", size } = {} }) => {
  return (
    <Card>
      <CardContent>
        <Typography>{name}</Typography>
        <Typography>{size}</Typography>
      </CardContent>
      <CardActions>
        <Button>Delete</Button>
      </CardActions>
    </Card>
  );
};

export default DocumentCard;
