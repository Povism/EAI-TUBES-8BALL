const searchResolvers   = require('./search');
const compareResolvers  = require('./compare');
const wishlistResolvers = require('./wishlist');
const reviewResolvers   = require('./review');

const rootValue = {
  ...searchResolvers.Query,
  ...compareResolvers.Query,
  ...wishlistResolvers.Query,
  ...reviewResolvers.Query,

  ...wishlistResolvers.Mutation,
  ...reviewResolvers.Mutation,
};

module.exports = rootValue;
