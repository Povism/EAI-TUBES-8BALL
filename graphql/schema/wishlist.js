const wishlistSchema = `
  type WishlistItem {
    id: Int!
    game_id: String!
    title: String!
    thumb: String
    added_at: String
  }

  type WishlistResult {
    success: Boolean!
    message: String!
    item: WishlistItem
  }

  extend type Query {
    getWishlist: [WishlistItem]
  }

  extend type Mutation {
    addToWishlist(gameID: String!, title: String!, thumb: String): WishlistResult!
    removeFromWishlist(gameID: String!): WishlistResult!
  }
`;

module.exports = wishlistSchema;
