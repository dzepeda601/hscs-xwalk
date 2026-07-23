/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.bcbsil.com/ — multiple instances:
 *   - member-spotlight: div.teaser.cmp-teaser--position-right (text + video)
 *   - careers:          div.teaser.cmp-teaser--position-left  (image + text)
 *   - about-us:         div.grid-container.cmp-grid-container--2col (text + image)  [cached source]
 * Columns block: NO field hints (per hinting rules — Columns blocks use default content only).
 * Library structure: multiple columns; row2 holds N cells (2 here) preserved in DOM order.
 */
export default function parse(element, { document }) {
  const cells = [];
  let columnEls = [];

  // Preferred: grid-container layout (about-us). Columns are the top-level grid items.
  const gridItems = element.querySelector(':scope .cmp-grid-container__items > .aem-Grid, :scope .cmp-grid-container__items');
  if (gridItems) {
    columnEls = Array.from(gridItems.children).filter(
      (c) => c.matches('.text, .image, .video, [class*="text"], [class*="image"], [class*="video"], [class*="teaser"]'),
    );
  }

  // Fallback: teaser layout (member-spotlight / careers) — text-container + media/image side by side.
  if (columnEls.length < 2) {
    const textCol = element.querySelector(
      '.cmp-teaser__content, .cmp-teaser__text-container, .cmp-text, [class*="content"]',
    );
    const mediaCol = element.querySelector(
      '.cmp-teaser__image, .cmp-image, .cmp-video, video, [class*="image"], [class*="video"]',
    );
    columnEls = [textCol, mediaCol].filter(Boolean);
    // Preserve visual order for --position-left variants where media precedes text.
    if (element.matches('.cmp-teaser--position-left, [class*="position-left"]') && columnEls.length === 2) {
      columnEls = [mediaCol, textCol];
    }
  }

  // Empty-block guard.
  if (columnEls.length < 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Row 2: one cell per column, content in DOM/visual order. No field hints for columns blocks.
  cells.push(columnEls.map((col) => col));

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
