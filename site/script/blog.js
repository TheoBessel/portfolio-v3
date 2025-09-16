/* blog.js
 * Blog page specific scripts
*/

import { Cache } from './cache.js';
import { parseHTML } from './utils.js';
import { createCard } from './components/card.js';
import { posts } from '../articles/articles.js';

const postCache = new Cache();

async function importMeta(name) {
    const base = posts[name];
    if(!base) throw new Error(`Unknown post: ${name}`);
    const url = `${base}/meta.html`;
    return fetch(url)
      .then(res => {
        if(!res.ok) throw new Error(`Failed to fetch meta for ${name}`);
        return res.text();
      });
}

export async function importPost(name) {
  // Load post from cache or fetch
  if(postCache.has(name)) {
    return postCache.get(name);
  } else {
    const base = posts[name];
    if(!base) throw new Error(`Unknown post: ${name}`);
    const url = `${base}/index.html`;
    return fetch(url)
      .then(res => {
        if(!res.ok) throw new Error(`Failed to fetch post ${name}`);
        return res.text();
      })
      .then(text => {
        return postCache.set(name, text);
      });
  }
}

/*
 * Blog page loading with caching
 * This loads the list of posts with their metadata
 */
export async function loadBlogPage() {
  const postList = document.querySelector('#post-list');
  postList.innerHTML = '';

  for(const postName in posts) {
    try {
      const metaHTML = parseHTML(await importMeta(postName));
      postList.innerHTML += createCard(postName, metaHTML).outerHTML;
    } catch (err) {
      console.warn('Skipping post', postName, 'due to meta load error', err);
    }
  }
}

/*
 * Load a single post into the main content area.
 * This is used when the route is #/blog/<postName>
 */
export async function loadPost(name) {
  const html = await importPost(name);
  const main = document.querySelector('main');
  main.innerHTML = parseHTML(html);
}