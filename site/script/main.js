/* main.js
 * Main script for the SPA
 */
import { Hash } from './hash.js';
import { loadPage } from './router.js';

// Link interception for SPA navigation
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if(a && Hash.isHash(a.getAttribute('href'))) {
    e.preventDefault();
    const hash = new Hash(a.getAttribute('href'));
    loadPage(hash);
  }
});

// Chargement initial selon hash
const initialHash = new Hash(location.hash || 'home');
loadPage(initialHash, true);

// Gestion de la navigation via l'historique (boutons arrière/avant)
window.addEventListener('hashchange', () => {
  const h = new Hash(location.hash || 'home');
  // Ne pas ajouter une nouvelle entrée d'historique
  loadPage(h, false);
});

// Fallback pour certains environnements : écouter popstate
window.addEventListener('popstate', () => {
  const h = new Hash(location.hash || 'home');
  loadPage(h, false);
});