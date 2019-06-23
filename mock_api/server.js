const jsonServer = require("json-server");
let documents = require("./documents.json");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Get routes
server.get("/documents/:name?", (req, res) => {
  const {
    query: { name }
  } = req;
  // If name is not empty filter documents by name
  if (name) {
    res.json(
      documents.filter(({ name: docName }) =>
        docName.toLowerCase().includes(name.toLowerCase())
      )
    );
  } else {
    res.json(documents);
  }
});

// Delete routes
server.delete("/documents/:id", (req, res) => {
  const {
    params: { id }
  } = req;
  // Ideally server should be stateless and documents state wouldn't be stored
  // on the server
  documents = documents.filter(({ id: docId }) => docId !== id);
  res.sendStatus(200);
});

server.use(router);
server.listen(4000, () => {
  console.log("JSON Server is running on port 4000");
});
