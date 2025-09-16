/* router.js
 * Routing and dynamic page loading for the SPA
 */
import { Hash } from './hash.js';
import { Cache } from './cache.js';
import { parseHTML } from './utils.js';
import { loadBlogPage, loadPost } from './blog.js'
import { loadProjectsPage, loadProject } from './projects.js'

const main = document.querySelector('main');
const pageCache = new Cache();
const pages = {
  home: 'pages/home.html',
  projects: 'pages/projects.html',
  blog: 'pages/blog.html',
  contact: 'pages/contact.html',
  error404: 'pages/404.html'
};

/*
 * HTML page caching
 */
async function importPage(id) {
  // Load page from cache or fetch
  if(pageCache.has(id)) {
    return pageCache.get(id);
  } else {
    // Resolve the URL for known pages, blog posts or fallback
    let url;
    if(pages[id]) {
      url = pages[id];
    } else if(id.startsWith('blog/')) {
      // route to a specific blog post (pages/posts/<name>/index.html)
      const parts = id.split('/');
      const postName = parts[1];
      url = `pages/posts/${postName}/index.html`;
    } else {
      url = pages.error404;
    }

    return fetch(url)
      .then(res => res.text())
      .then(text => {
        return pageCache.set(id, text);
      })
      .catch(err => {
        console.error('Failed to import page', id, err);
        // try to load 404 page
        return fetch(pages.error404).then(r => r.text()).then(t => pageCache.set(id, t));
      });
  }
}

/*
 * HTML page loading with caching
 */
export async function loadPage(hash, addHistory=true) {
  const text = await importPage(hash.asString());

  // Get the inner HTML of the body
  main.innerHTML = parseHTML(text);

  // Update URL hash
  addHistory ? location.hash = hash.asHash() : null;

  // If blog page, load blog posts
  const hstr = hash.asString();
  if(hstr === 'blog') {
    await loadBlogPage();
  } else if(hstr.startsWith('blog/')) {
    const parts = hstr.split('/');
    const postName = parts[1];
    try {
      // Ensure the post-specific logic runs (may re-use cache)
      await loadPost(postName);
    } catch (err) {
      console.error('Failed to load blog post', postName, err);
    }
  } else if(hstr === 'projects') {
    await loadProjectsPage();
  } else if(hstr.startsWith('projects/')) {
    const parts = hstr.split('/');
    const projectName = parts[1];
    try {
      await loadProject(projectName);
    } catch (err) {
      console.error('Failed to load project', projectName, err);
    }
  }

  // Update nav active state
  document.querySelectorAll('nav a').forEach(a => {
    const hrefHash = new Hash(a.getAttribute('href'));
    // Consider the blog nav item active when viewing any blog route
    const isActive = hrefHash.equals(hash) || (hrefHash.asString() === 'blog' && hstr.startsWith('blog') || (hrefHash.asString() === 'projects' && hstr.startsWith('projects')));
    a.classList.toggle('active', isActive);
  });
}
