/* hash.js
 * Hash management for the SPA
 */
export class Hash {
  constructor(hash) {
    this.hash = Hash.isHash(hash) ? hash.slice(2) : hash;
  }

  static isHash(str) {
    return str.startsWith('#/');
  }

  asString() {
    return this.hash;
  }

  asHash() {
    return '#/' + this.hash;
  }

  equals(other) {
    return this.hash === other.hash;
  }
}