# Charlie Paisan - 6/23/19

## Installation

To install dependencies run:

```
yarn
```

To start the app run:

```
yarn start:mocking
```

## Security

- Requests are currently made via HTTP - Remediate by configuring SSL certificate on the server
- There is no user authentication, user authorization or access control in place - Remediate by implementing user authentication and authorization to only allow authorized users to upload files
- File names are not sanitized - Remediate by sanitizing and escaping file names to avoid XSS attacks
- Backend validation is missing - Remediate by validating payloads before saving to the database
- Document ID's are currently integers that range from 1 - 10,000, which exposes a vulnerability for attackers to query a `documents` endpoint to possibly view documents that other users have uploaded - Remediate by using `uuid`'s so attackers cannot increment or decrement through document id's and implement proper access control depending on how the app is being used

## Improvements

- Identify a way to better handle errors uniformly across the app. Maybe a snackbar to notify users of success/failures.
- Support multi-file upload and create a modal to implement a drag-and-drop feature for uploading. The modal would then also notify the users of which documents were successfully uploaded and which weren't.
- Add a delete confirmation modal to confirm the correct document is being deleted.
- Add pagination or infinite scroll to scale the app when users upload more documents.
- Add authentication and access control.

## Libraries

- Material UI: Fully styled components with easy-to-use API
- Apollo: GraphQL API layer to handle query and mutation requests to the API
- Cypress: Testing tool that provides developer friendly tools to debug and write tests and encourage TDD
- Lodash.debounce: Debounced is used to throttle requests to the API.
- Unfetch: Used to replace `fetch` to allow for graphQL requests in Cypress, because Cypress uses `XHR` requests and not currently support `fetch`

## API

GraphQL queries are similar to HTTP `GET` requests, because they only request a resource and are not meant to handle any mutations.
GraphQL mutations are similar to HTTP `POST, PUT, PATCH, DELETE` requests, because they modify or create a new resource.

The app has one object type, `Document`, which is an object with id, name, and size as keys and a unique human readable ID, string, and integer as their values, respectively.
The `documents` query accepts one argument, `search`, which is used to filter `documents` matching the search string and returns an array of object type `Document`s. This query returns all documents if the `search` argument is `empty` or `null`
`uploadDocument` is the mutation used to create new documents and accepts the input type, `documentInput`, as an argument and returns an object type `Document`, which includes an `id` created by the server.
Lastly, the `deleteDocument` mutation accepts one argument, `id`, which is the document ID that will be deleted. This mutation returns `true` is the document is successfully deleted and `false` if there was an error and it was not deleted.

```
 type Document {
    id: ID
    name: String!
    size: Int!
  }

  input DocumentInput {
    name: String!
    size: Int!
    type: String!
  }

  type Query {
    documents(search: String): [Document]!
  }

  type Mutation {
    uploadDocument(file: Upload!): Document
    deleteDocument(id: ID!): Boolean!
  }

  scalar Upload
```

---
