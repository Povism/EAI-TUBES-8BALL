const searchSchema = `
  type Game {
    id: String!
    title: String!
    thumb: String
    cheapestPrice: String
    cheapestDealID: String
  }

  extend type Query {
    searchGames(title: String!): [Game]
  }
`;

module.exports = searchSchema;
