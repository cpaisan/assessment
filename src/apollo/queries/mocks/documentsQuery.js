/**
 * @param {int} max
 * @return {int}
 */
const getRandomInt = (max = 10) => Math.floor(Math.random() * max) + 1;

export default {
  Document: () => ({
    id: `${getRandomInt(10000)}`,
    name: `Doc${getRandomInt(400)}`,
    size: getRandomInt(600)
  })
};
