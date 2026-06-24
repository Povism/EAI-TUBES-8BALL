const searchResolvers   = require('./search');
const compareResolvers  = require('./compare');
const wishlistResolvers = require('./wishlist');
const reviewResolvers   = require('./review');

// Flatten all Query and Mutation maps into a single root object
// that graphql-http's rootValue option expects
const rootValue = {
  // ── Queries ──────────────────────────────────────
  ...searchResolvers.Query,
  ...compareResolvers.Query,
  ...wishlistResolvers.Query,
  ...reviewResolvers.Query,

  // ── Mutations ────────────────────────────────────
  ...wishlistResolvers.Mutation,
  ...reviewResolvers.Mutation,
};

module.exports = rootValue;
