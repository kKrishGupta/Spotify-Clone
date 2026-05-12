const redis =
  require("../config/redis");

// 🚀 VECTOR KEY
const vectorKey =
  (
    namespace,
    id
  ) =>
    `vector:${namespace}:${id}`;

// 🚀 UPSERT
const upsertVector =
  async (
    namespace,
    id,
    payload
  ) => {

    const key =
      vectorKey(
        namespace,
        id
      );

    await redis.client.set(
      key,

      JSON.stringify({
        ...payload,

        updatedAt:
          Date.now(),
      })
    );

    return payload;
  };

// 🚀 GET VECTOR
const getVector =
  async (
    namespace,
    id
  ) => {

    const key =
      vectorKey(
        namespace,
        id
      );

    const data =
      await redis.client.get(
        key
      );

    return data
      ? JSON.parse(data)
      : null;
  };

// 🚀 FIND ALL
const findByNamespace =
  async (
    namespace
  ) => {

    const keys =
      await redis.client.keys(
        `vector:${namespace}:*`
      );

    if (!keys.length)
      return [];

    const values =
      await Promise.all(
        keys.map(
          (key) =>
            redis.client.get(
              key
            )
        )
      );

    return values
      .filter(Boolean)
      .map(JSON.parse);
  };

// 🚀 COSINE SIMILARITY
const cosineSimilarity =
  (
    a,
    b
  ) => {

    const keys =
      Object.keys(a);

    let dot = 0;

    let magA = 0;

    let magB = 0;

    for (const key of keys) {

      const x =
        Number(
          a[key]
        ) || 0;

      const y =
        Number(
          b[key]
        ) || 0;

      dot += x * y;

      magA += x * x;

      magB += y * y;
    }

    return (
      dot /
      (
        Math.sqrt(
          magA
        ) *
        Math.sqrt(
          magB
        ) || 1
      )
    );
  };

module.exports = {
  upsertVector,
  getVector,
  findByNamespace,
  cosineSimilarity,
};