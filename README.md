# Charlie - 6/23/19

## Installation

To install dependencies run:

```
yarn
```

To start the app run:

```
yarn start:mocking
```

## Tests

To run tests run:

```
yarn test
```

## Security

- Requests are currently made via HTTP - Remediate by configuring SSL certificate on the server
- There is no user authentication, user authorization or access control in place - Remediate by implementing user authentication and authorization to only allow authorized users to upload files
- File names are not sanitized - Remediate by sanitizing and escaping special characters in file names to avoid XSS attacks and SQL injection
- Backend validation is missing - Remediate by validating payloads and escaping any unwanted characters before performing any database actions
- Document ID's are currently integers that range from 1 - 10,000 (this is no longer the case after I added the mock server and added uuid as a dependency), which exposes a vulnerability for attackers to query the `documents` endpoint to possibly view documents that other users have uploaded - Remediate by using `uuid`'s so attackers cannot increment or decrement through document id's and implement proper access control depending on how the app is being used
- Documents should not be stored directly on the server in case the server is compromised - Ideally, the server should be stateless and the file should be pushed to an S3 bucket or similar service
- Configure CORS correctly on our API server to only allow requests from certain origins to access the API

## Improvements

- Identify a way to better handle errors uniformly across the app. Maybe a snackbar to notify users of success/failures.
- Support multi-file upload and create a modal to implement a drag-and-drop feature for uploading. The modal would then also notify the users of which documents were successfully uploaded and which weren't.
- Add a delete confirmation modal to confirm the correct document is being deleted.
- Add pagination or infinite scroll to scale the app when users upload more documents.
- Add authentication and access control.

## Libraries

- Material UI: Fully styled components with easy-to-use API
- Cypress: Testing tool that provides developer friendly tools to debug and write tests and encourage TDD
- Lodash.debounce: Debounced is used to throttle requests to the API
- Axios: Used to make AJAX requests to API
- Multer: Save files to the Node.js mock server
- JSON Server: Library used to bootstrap and mock our API
- Nodemon: Enables hot reloading to improve developer experience
- uuid: Provides a unique id to use for newly uploaded documents
- start-server-and-test: Provides a useful script command for starting the dev server and testing

## API

```
### GET /documents/:name?
Example response:
  [
    {
      "id": "5441",
      "name": "baz",
      "size": 412
    },
    {
      "id": "2824",
      "name": "qux",
      "size": 508
    },
  ]
- Returns an array of documents. If a name parameter is present, filter the documents by name
  that include the name parameter
### DELETE /documents/:id
- Removes the document with the id that is passed via the route parameters.
  Returns status code 200 for delete success and 4xx/5xx for delete errors
### POST /document
Example request (Form Data containing a File object):
  {
    "lastModified": 1550694440000,
    "lastModifiedDate": "Web June 18",
    "name": "google.jpg",
    "size": 9469952,
    "type": "image/jpeg",
    "webkitRelativePath": ""
  }
Example response:
  {
    "id": "${someNewUuid}",
    "name": "New Document",
    "size": 777
  },
- Saves request file to an uploads folder in the mock_api and returns the newly uploaded file with a uuid
```

---
