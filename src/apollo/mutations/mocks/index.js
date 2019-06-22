/**
 * @param {int} max
 * @return {int}
 */
const getRandomInt = (max = 10) => Math.floor(Math.random() * max) + 1;

export default {
  Mutation: () => ({
    deleteDocument: () => true,
    uploadDocument: (_, { file: { name, size } = {} }) => ({
      name,
      size,
      id: `${getRandomInt(10000)}`
    })
  })
};
