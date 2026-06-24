const fetch = require('node-fetch');

const CHEAPSHARK_BASE = 'https://www.cheapshark.com/api/1.0';

const searchResolvers = {
  Query: {
    searchGames: async ({ title }) => {
      const response = await fetch(
        `${CHEAPSHARK_BASE}/games?title=${encodeURIComponent(title)}&limit=20`
      );
      if (!response.ok) throw new Error(`CheapShark API responded with ${response.status}`);
      const data = await response.json();
      return data.map((g) => ({
        id: g.gameID,
        title: g.external,
        thumb: g.thumb,
        cheapestPrice: g.cheapest,
        cheapestDealID: g.cheapestDealID,
      }));
    },
  },
};

module.exports = searchResolvers;
