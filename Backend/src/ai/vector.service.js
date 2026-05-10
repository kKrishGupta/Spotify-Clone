const memory = new Map();

const upsertVector = async (namespace, id, payload) => {
  const key = `${namespace}:${id}`;
  memory.set(key, {
    ...payload,
    updatedAt: new Date(),
  });
  return memory.get(key);
};

const findByNamespace = async (namespace) =>
  [...memory.entries()]
    .filter(([key]) => key.startsWith(`${namespace}:`))
    .map(([, value]) => value);

module.exports = {
  upsertVector,
  findByNamespace,
};
