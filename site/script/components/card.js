/* card.js
 * Card component for blog posts
 * It uses name and meta HTML to create a card
 */
export function createCard(name, metaHTML, base = 'blog') {
    // base: 'blog' or 'projects' to build the correct href
    console.log("Creating card for:", name, "base:", base);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <a href="#/${base}/${name}">
            <article class="card-content">
                ${metaHTML}
            </article>
        </a>
    `;
    return card;
}