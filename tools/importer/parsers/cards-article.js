/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.bcbsil.com/ (#ArticlesandInsights section.cmp-article-grid)
 * Generated for xwalk project — includes field hints per item model blocks/cards-article/_cards-article.json.
 * Item model "card" fields: image (reference), text (richtext).
 * Library structure: container block, one row per card, 2 cells — cell1 image, cell2 richtext (category tag + heading link).
 */
export default function parse(element, { document }) {
  // Each card is a <li class="cmp-article-grid__article">.
  const cards = Array.from(element.querySelectorAll('li.cmp-article-grid__article, .cmp-article-grid__article'));

  // Empty-block guard.
  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    // The card content is wrapped in an anchor carrying the article URL.
    const container = card.querySelector('a.cmp-article-grid__item-container, a[href]');
    const href = container ? container.getAttribute('href') : null;

    // --- Cell 1: image (imageAlt collapses into the img alt attribute). ---
    const image = card.querySelector('img.cmp-article-grid__item-image, img');
    let imageCell = '';
    if (image) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:image '));
      frag.appendChild(image);
      imageCell = frag;
    }

    // --- Cell 2: text (category tag + heading rendered as a link). ---
    const category = card.querySelector('.cmp-article-grid__item-category');
    const heading = card.querySelector('.cmp-article-grid__item-description, h3, h2, h4');

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    if (category) {
      const cat = document.createElement('p');
      cat.textContent = category.textContent.trim();
      textFrag.appendChild(cat);
    }

    if (heading) {
      // Preserve heading semantics; wrap title text in the article link when available.
      const headingTag = heading.tagName && /^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h3';
      const h = document.createElement(headingTag);
      const titleText = heading.textContent.replace(/\s+/g, ' ').trim();
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        if (container && container.getAttribute('title')) a.setAttribute('title', container.getAttribute('title'));
        a.textContent = titleText;
        h.appendChild(a);
      } else {
        h.textContent = titleText;
      }
      textFrag.appendChild(h);
    }

    cells.push([imageCell, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
