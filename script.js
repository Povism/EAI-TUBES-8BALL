const GRAPHQL_ENDPOINT = '/graphql';

let currentGame = null;

async function gql(query, variables = {}) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

document.querySelectorAll('.subnav-link').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.subnav-link').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));

    btn.classList.add('active');
    const view = btn.dataset.view;
    document.getElementById(`view-${view}`).classList.add('active');

    if (view === 'wishlist') loadWishlist();
  });
});

document.getElementById('search-btn').addEventListener('click', doSearch);
document.getElementById('search-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

async function doSearch() {
  const title = document.getElementById('search-input').value.trim();
  if (!title) return;

  const resultsEl = document.getElementById('search-results');
  resultsEl.innerHTML = '<p class="empty-msg">Searching...</p>';

  try {
    const data = await gql(`
      query SearchGames($title: String!) {
        searchGames(title: $title) {
          id
          title
          thumb
          cheapestPrice
          cheapestDealID
        }
      }
    `, { title });

    const games = data.searchGames;
    if (!games || games.length === 0) {
      resultsEl.innerHTML = '<p class="empty-msg">No games found.</p>';
      return;
    }

    resultsEl.innerHTML = '';
    games.forEach((game) => resultsEl.appendChild(renderGameCard(game)));
  } catch (err) {
    resultsEl.innerHTML = `<p class="empty-msg">Error: ${err.message}</p>`;
  }
}

function renderGameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.innerHTML = `
    <img src="${game.thumb || 'https://via.placeholder.com/180x100?text=No+Image'}" alt="${game.title}" />
    <div class="info">
      <h4>${game.title}</h4>
      <span class="price-tag">$${game.cheapestPrice}</span>
    </div>
  `;
  card.addEventListener('click', () => openGameDetail(game));
  return card;
}

async function openGameDetail(game) {
  currentGame = game;
  document.getElementById('modal-title').textContent = game.title;
  document.getElementById('modal-thumb').src = game.thumb || '';
  document.getElementById('detail-modal').classList.remove('hidden');

  await loadDeals(game.id);
  await loadReviews(game.id);
}

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('detail-modal').classList.add('hidden');
});

async function loadDeals(gameID) {
  const dealsEl = document.getElementById('modal-deals');
  dealsEl.innerHTML = '<p class="empty-msg">Loading prices...</p>';

  try {
    const data = await gql(`
      query GetGameDeals($gameID: String!) {
        getGameDeals(gameID: $gameID) {
          deals {
            store
            price
            savings
          }
        }
      }
    `, { gameID: String(gameID) });

    const deals = data.getGameDeals?.deals;
    if (!deals || deals.length === 0) {
      dealsEl.innerHTML = '<p class="empty-msg">No price data available.</p>';
      return;
    }

    dealsEl.innerHTML = '';
    deals.forEach((deal) => {
      const row = document.createElement('div');
      row.className = 'deal-row';
      row.innerHTML = `<span>${deal.store}</span><span class="price-tag">$${deal.price} (-${deal.savings})</span>`;
      dealsEl.appendChild(row);
    });
  } catch (err) {
    dealsEl.innerHTML = `<p class="empty-msg">Error loading prices: ${err.message}</p>`;
  }
}

document.getElementById('modal-wishlist-btn').addEventListener('click', async () => {
  if (!currentGame) return;
  try {
    const data = await gql(`
      mutation AddToWishlist($gameID: String!, $title: String!, $thumb: String) {
        addToWishlist(gameID: $gameID, title: $title, thumb: $thumb) {
          success
          message
        }
      }
    `, {
      gameID: String(currentGame.id),
      title: currentGame.title,
      thumb: currentGame.thumb || '',
    });

    alert(data.addToWishlist.message);
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

async function loadWishlist() {
  const el = document.getElementById('wishlist-results');
  el.innerHTML = '<p class="empty-msg">Loading...</p>';

  try {
    const data = await gql(`
      query {
        getWishlist {
          id
          game_id
          title
          thumb
        }
      }
    `);

    const items = data.getWishlist;
    if (!items || items.length === 0) {
      el.innerHTML = '<p class="empty-msg">Your wishlist is empty.</p>';
      return;
    }

    el.innerHTML = '';
    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `
        <img src="${item.thumb || 'https://via.placeholder.com/180x100?text=No+Image'}" alt="${item.title}" />
        <div class="info">
          <h4>${item.title}</h4>
          <button class="remove-btn" data-id="${item.game_id}">Remove</button>
        </div>
      `;
      card.querySelector('.remove-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await gql(`
            mutation RemoveFromWishlist($gameID: String!) {
              removeFromWishlist(gameID: $gameID) {
                success
                message
              }
            }
          `, { gameID: item.game_id });
          loadWishlist();
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
      el.appendChild(card);
    });
  } catch (err) {
    el.innerHTML = `<p class="empty-msg">Error: ${err.message}</p>`;
  }
}

async function loadReviews(gameID) {
  const el = document.getElementById('modal-reviews');
  el.innerHTML = '<p class="empty-msg">Loading reviews...</p>';

  try {
    const data = await gql(`
      query GetReviews($gameID: String!) {
        getReviews(gameID: $gameID) {
          id
          username
          rating
          comment
        }
      }
    `, { gameID: String(gameID) });

    const reviews = data.getReviews;
    if (!reviews || reviews.length === 0) {
      el.innerHTML = '<p class="empty-msg">No reviews yet. Be the first!</p>';
      return;
    }

    el.innerHTML = '';
    reviews.forEach((r) => {
      const row = document.createElement('div');
      row.className = 'review-row';
      row.innerHTML = `
        <div class="review-header">
          <strong>${r.username} — ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</strong>
          <button class="review-delete-btn" data-id="${r.id}" title="Delete review">&times;</button>
        </div>
        <span>${r.comment || ''}</span>
      `;
      row.querySelector('.review-delete-btn').addEventListener('click', async () => {
        if (!confirm('Delete this review?')) return;
        try {
          await gql(`
            mutation DeleteReview($id: Int!) {
              deleteReview(id: $id) {
                success
                message
              }
            }
          `, { id: r.id });
          loadReviews(gameID);
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
      el.appendChild(row);
    });
  } catch (err) {
    el.innerHTML = `<p class="empty-msg">Error: ${err.message}</p>`;
  }
}

document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentGame) return;

  const username = document.getElementById('review-username').value.trim();
  const rating   = parseInt(document.getElementById('review-rating').value, 10);
  const comment  = document.getElementById('review-comment').value.trim();

  try {
    const data = await gql(`
      mutation AddReview($gameID: String!, $title: String, $username: String!, $rating: Int!, $comment: String) {
        addReview(gameID: $gameID, title: $title, username: $username, rating: $rating, comment: $comment) {
          success
          message
        }
      }
    `, {
      gameID: String(currentGame.id),
      title: currentGame.title,
      username,
      rating,
      comment,
    });

    if (data.addReview.success) {
      document.getElementById('review-form').reset();
      loadReviews(currentGame.id);
    } else {
      alert(data.addReview.message);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
});