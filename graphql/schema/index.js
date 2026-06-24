const searchSchema   = require('./search');
const compareSchema  = require('./compare');
const wishlistSchema = require('./wishlist');
const reviewSchema   = require('./review');

const baseSchema = `
  type Query
  type Mutation
`;

const typeDefs = [baseSchema, searchSchema, compareSchema, wishlistSchema, reviewSchema].join('\n');

module.exports = typeDefs;
