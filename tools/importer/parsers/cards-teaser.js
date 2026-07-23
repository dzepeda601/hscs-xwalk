/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-teaser. Base: cards.
 * Source: https://www.bcbsil.com/ (#SmartChoice div.grid-container.cmp-grid-container--3col)
 * Generated for xwalk project — includes field hints per item model blocks/cards-teaser/_cards-teaser.json.
 * Item model "card" fields: image (reference), text (richtext).
 * Library structure: container block, one row per card, 2 cells — cell1 image, cell2 richtext (heading + description + CTA).
 */
export default function parse(element, { document }) {
  // Each card in the source is a .value-prop / .cmp-value-prop unit.
  const cards = Array.from(element.querySelectorAll('.cmp-value-prop, .value-prop > .cmp-value-prop'));

  // Empty-block guard.
  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    // Cell 1: image (imageAlt collapses into the img alt attribute).
    const image = card.querySelector('img.cmp-value-prop__image, img');
    let imageCell = '';
    if (image) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:image '));
      frag.appendChild(image);
      imageCell = frag;
    }

    // Cell 2: text — heading (proposition), description, CTA.
    const heading = card.querySelector('.cmp-value-prop__proposition');
    const description = card.querySelector('.cmp-value-prop__description');
    const cta = card.querySelector('a.cmp-value-prop__cta, .cmp-value-prop__text-wrap a');

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (heading) {
      // Promote the proposition paragraph to a heading for card title semantics.
      const h = document.createElement('h3');
      h.innerHTML = heading.innerHTML;
      textFrag.appendChild(h);
    }
    if (description) textFrag.appendChild(description);
    if (cta) textFrag.appendChild(cta);

    cells.push([imageCell, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-teaser', cells });
  element.replaceWith(block);
}
