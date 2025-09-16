/* cache.js
 * Caching mechanisms for the SPA
 */
export class Cache {
  constructor() {
    this.cache = {};
  }

  has(key) {
    return key in this.cache;
  }

  get(key) {
    return this.cache[key];
  }

  set(key, value) {
    this.cache[key] = value;
    return value;
  }

  clear() {
    this.cache = {};
  }
}