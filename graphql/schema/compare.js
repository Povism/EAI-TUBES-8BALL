const compareSchema = `
  type Deal {
    store: String!
    storeID: String
    price: String!
    retailPrice: String
    savings: String
    dealID: String
  }

  type GameInfo {
    title: String
    thumb: String
  }

  type GameDeals {
    info: GameInfo
    deals: [Deal]
    note: String
  }

  extend type Query {
    getGameDeals(gameID: String!): GameDeals
  }
`;

module.exports = compareSchema;
