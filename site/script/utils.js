/* utils.js
 * Utility functions for the SPA
 */

/*
 * HTML page parsing
 */
export function parseHTML(text) {
  const bodyMatch = text.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : text;
}