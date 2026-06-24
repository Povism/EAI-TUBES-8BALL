const db = require('../../db');

const wishlistResolvers = {
  Query: {

    getWishlist: () => {
      return db.prepare('SELECT * FROM wishlist ORDER BY added_at DESC').all();
    },
  },

  Mutation: {
    addToWishlist: ({ gameID, title, thumb }) => {
      if (!gameID || !title) {
        return { success: false, message: 'gameID and title are required', item: null };
      }
      const existing = db.prepare('SELECT * FROM wishlist WHERE game_id = ?').get(String(gameID));
      if (existing) {
        return { success: false, message: 'Game is already in your wishlist', item: existing };
      }
      db.prepare('INSERT INTO wishlist (game_id, title, thumb) VALUES (?, ?, ?)').run(
        String(gameID), title, thumb || null
      );
      const item = db.prepare('SELECT * FROM wishlist WHERE game_id = ?').get(String(gameID));
      return { success: true, message: `"${title}" added to wishlist`, item };
    },

    removeFromWishlist: ({ gameID }) => {
      const existing = db.prepare('SELECT * FROM wishlist WHERE game_id = ?').get(String(gameID));
      if (!existing) {
        return { success: false, message: 'Game not found in wishlist', item: null };
      }
      db.prepare('DELETE FROM wishlist WHERE game_id = ?').run(String(gameID));
      return { success: true, message: `"${existing.title}" removed from wishlist`, item: existing };
    },
  },
};

module.exports = wishlistResolvers;
