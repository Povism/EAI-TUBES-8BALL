const reviewSchema = `
  type Review {
    id: Int!
    game_id: String!
    title: String
    username: String!
    rating: Int!
    comment: String
    created_at: String
  }

  type ReviewResult {
    success: Boolean!
    message: String!
    review: Review
  }

  extend type Query {
    getReviews(gameID: String!): [Review]
  }

  extend type Mutation {
    addReview(
      gameID: String!
      title: String
      username: String!
      rating: Int!
      comment: String
    ): ReviewResult!

    deleteReview(id: Int!): ReviewResult!
  }
`;

module.exports = reviewSchema;
