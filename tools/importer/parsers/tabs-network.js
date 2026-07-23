/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-network. Base: tabs.
 * Source: https://www.bcbsil.com/ (#OurNetwork div.tabs)
 * Generated for xwalk project — includes field hints per item model blocks/tabs-network/_tabs-network.json.
 * Item model "tabs-network-item" fields:
 *   title (tab label)           -> cell 1
 *   content_heading (richtext)  -> cell 2 (content_* prefix grouped into one cell)
 *   content_headingType         -> collapsed (Type suffix), no hint
 *   content_image (reference)   -> cell 2
 *   content_richtext (richtext) -> cell 2
 * Library structure: 2 columns, one row per tab — cell1 tab label, cell2 tab content.
 */
export default function parse(element, { document }) {
  // Tab labels (<li class="cmp-tabs__tab"> with id "tab-XXX-tab").
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab, li.cmp-tabs__tab'));
  // Tab panels (<div class="cmp-tabs__tabpanel"> with id "tab-XXX").
  const tabPanels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  // Empty-block guard.
  if (!tabLabels.length || !tabPanels.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Map panel id -> panel element for label/panel pairing.
  const panelById = new Map();
  tabPanels.forEach((panel) => {
    if (panel.id) panelById.set(panel.id, panel);
  });

  const cells = [];

  tabLabels.forEach((label, index) => {
    // Resolve the matching panel: label id "tab-XXX-tab" -> panel id "tab-XXX".
    let panel = null;
    if (label.id && label.id.endsWith('-tab')) {
      panel = panelById.get(label.id.slice(0, -'-tab'.length));
    }
    if (!panel) panel = tabPanels[index] || null;

    // --- Cell 1: tab label (title). ---
    const titleFrag = document.createDocumentFragment();
    titleFrag.appendChild(document.createComment(' field:title '));
    const titleP = document.createElement('p');
    titleP.textContent = label.textContent.trim();
    titleFrag.appendChild(titleP);

    // --- Cell 2: content (content_heading + content_image + content_richtext). ---
    const contentFrag = document.createDocumentFragment();

    const heading = panel && panel.querySelector('.cmp-teaser__title, h3, h4, h5');
    const image = panel && panel.querySelector('.cmp-teaser__media img, .cmp-image img, img');
    const subtitle = panel && panel.querySelector('.cmp-teaser__subtitle');
    const description = panel && panel.querySelector('.cmp-teaser__description, .cmp-teaser__content .cmp-text');
    const cta = panel && panel.querySelector('a.cmp-teaser__action-link, .cmp-teaser__action-container a');

    // content_heading (heading text; content_headingType is collapsed → the element tag carries it).
    if (heading) {
      contentFrag.appendChild(document.createComment(' field:content_heading '));
      contentFrag.appendChild(heading);
    }

    // content_image (imageAlt-style collapse into the img alt attribute).
    if (image) {
      contentFrag.appendChild(document.createComment(' field:content_image '));
      contentFrag.appendChild(image);
    }

    // content_richtext (subtitle + description + CTA as rich text body).
    const richParts = [];
    if (subtitle) richParts.push(subtitle);
    if (description) richParts.push(description);
    if (cta) richParts.push(cta);
    if (richParts.length) {
      contentFrag.appendChild(document.createComment(' field:content_richtext '));
      richParts.forEach((p) => contentFrag.appendChild(p));
    }

    cells.push([titleFrag, contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-network', cells });
  element.replaceWith(block);
}
