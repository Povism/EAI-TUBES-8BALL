const db = require('../../db');

const reviewResolvers = {
  Query: {
    // Return all reviews for a specific game, newest first
    getReviews: ({ gameID }) => {
      return db
        .prepare('SELECT * FROM reviews WHERE game_id = ? ORDER BY created_at DESC')
        .all(String(gameID));
    },
  },

  Mutation: {
    // Submit a new review for a game
    addReview: ({ gameID, title, username, rating, comment }) => {
      if (!gameID || !username || !rating) {
        return { success: false, message: 'gameID, username, and rating are required', review: null };
      }
      if (rating < 1 || rating > 5) {
        return { success: false, message: 'Rating must be between 1 and 5', review: null };
      }
      const result = db
        .prepare('INSERT INTO reviews (game_id, title, username, rating, comment) VALUES (?, ?, ?, ?, ?)')
        .run(String(gameID), title || '', username, rating, comment || '');
      const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
      return { success: true, message: 'Review submitted successfully', review };
    },

    // Delete a review by its ID
    deleteReview: ({ id }) => {
      const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
      if (!existing) {
        return { success: false, message: 'Review not found', review: null };
      }
      db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
      return { success: true, message: 'Review deleted successfully', review: existing };
    },
  },
};

module.exports = reviewResolvers;
