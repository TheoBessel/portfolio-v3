/* projects.js
 * Projects page specific scripts (parallels blog.js)
 */

import { Cache } from './cache.js';
import { parseHTML } from './utils.js';
import { createCard } from './components/card.js';
import { projects } from '../articles/articles.js';

const projectCache = new Cache();

async function importMeta(name) {
    const base = projects[name];
    if(!base) throw new Error(`Unknown project: ${name}`);
    const url = `${base}/meta.html`;
    return fetch(url)
      .then(res => {
        if(!res.ok) throw new Error(`Failed to fetch meta for project ${name}`);
        return res.text();
      });
}

export async function importProject(name) {
  if(projectCache.has(name)) {
    return projectCache.get(name);
  } else {
    const base = projects[name];
    if(!base) throw new Error(`Unknown project: ${name}`);
    const url = `${base}/index.html`;
    return fetch(url)
      .then(res => {
        if(!res.ok) throw new Error(`Failed to fetch project ${name}`);
        return res.text();
      })
      .then(text => projectCache.set(name, text));
  }
}

export async function loadProjectsPage() {
  const projectList = document.querySelector('#project-list');
  if(!projectList) return;
  projectList.innerHTML = '';

  for(const projectName in projects) {
    try {
      const metaHTML = parseHTML(await importMeta(projectName));
      projectList.innerHTML += createCard(projectName, metaHTML, 'projects').outerHTML;
    } catch (err) {
      console.warn('Skipping project', projectName, 'due to meta load error', err);
    }
  }
}

export async function loadProject(name) {
  const html = await importProject(name);
  const main = document.querySelector('main');
  main.innerHTML = parseHTML(html);
}
