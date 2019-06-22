/**
 * @param {int} max
 * @return {int}
 */
const getRandomInt = (max = 10) => Math.floor(Math.random() * max) + 1;

const mockNames = [
  "foobar",
  "foo",
  "bar",
  "baz",
  "qux",
  "quux",
  "quuz",
  "corge",
  "grault",
  "garply",
  "waldo",
  "fred",
  "plugh",
  "xyzzy",
  "thud"
];

export const mockDocuments = mockNames.map(name => {
  return {
    id: `${getRandomInt(10000)}`,
    name,
    size: getRandomInt(600)
  };
});

export default {
  Document: () => []
};
