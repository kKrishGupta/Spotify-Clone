const Groq =
  require("groq-sdk");

const AppError =
  require(
    "../utils/AppError"
  );

const logger =
  require(
    "../config/logger"
  );

let client;

/* =========================================
   🚀 GET AI CLIENT
========================================= */

const getClient =
  () => {

    if (
      !process.env
        .GROQ_API_KEY
    ) {

      throw new AppError(
        "AI provider is not configured",
        503
      );
    }

    if (!client) {

      client =
        new Groq({
          apiKey:
            process.env
              .GROQ_API_KEY,
        });
    }

    return client;
  };

/* =========================================
   🚀 GENERATE EMBEDDING
========================================= */

const generateEmbedding =
  async (text) => {

    if (!text) {

      return [];
    }

    try {

      // ⚠️ Fake lightweight embedding for now
      // Later replace with:
      // OpenAI embeddings
      // HuggingFace embeddings
      // vector DB embeddings

      return text
        .toLowerCase()
        .split(/\s+/)
        .map(
          (
            token
          ) =>

            token.length
        );

    } catch (err) {

      logger.error({
        message:
          "Embedding generation failed",

        error:
          err.message,
      });

      return [];
    }
  };

/* =========================================
   🚀 GENERATE RESPONSE
========================================= */

const generateResponse =
  async (
    prompt
  ) => {

    try {

      const res =
        await getClient()

          .chat
          .completions
          .create({

            model:
              process.env
                .GROQ_MODEL ||

              "llama-3.1-8b-instant",

            messages: [

              {
                role:
                  "system",

                content:
                  "You are a helpful AI music assistant.",
              },

              {
                role:
                  "user",

                content:
                  prompt,
              },
            ],
          });

      return (
        res.choices?.[0]
          ?.message
          ?.content || ""
      );

    } catch (err) {

      logger.error({
        message:
          "AI response generation failed",

        error:
          err.message,
      });

      throw new AppError(
        "AI response failed",
        500
      );
    }
  };

/* =========================================
   🚀 GENERATE AI REPLY
========================================= */

const generateReply =
  async (
    userId,
    message
  ) => {

    if (!message) {

      throw new AppError(
        "Message is required",
        400
      );
    }

    /* =====================================
       🧠 EMBEDDING
    ===================================== */

    const embedding =
      await generateEmbedding(
        message
      );

    logger.info({
      message:
        "AI embedding generated",

      userId,

      dimensions:
        embedding.length,
    });

    /* =====================================
       🤖 AI RESPONSE
    ===================================== */

    const reply =
      await generateResponse(
        message
      );

    return {
      message:
        reply,

      embedding,
    };
  };

module.exports = {
  generateResponse,
  generateEmbedding,
  generateReply,
};