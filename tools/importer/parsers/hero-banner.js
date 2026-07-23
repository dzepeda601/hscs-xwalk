/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.bcbsil.com/ (#main-content div.hero.cmp-hero--color-dark-blue)
 * Generated for xwalk project — includes field hints per model blocks/hero-banner/_hero-banner.json.
 * Model fields: image (reference), imageAlt (collapsed→attr), text (richtext).
 * Library structure: 1 column, 3 rows — row1 block name, row2 background image, row3 heading+subheading+CTA.
 */
export default function parse(element, { document }) {
  // --- Extract content (selectors validated against source.html) ---
  const heading = element.querySelector('.cmp-hero__heading, h1, h2');
  const description = element.querySelector('.cmp-hero__description, .cmp-hero__content-container p');
  const primaryCta = element.querySelector('a.cmp-hero__cta, .cmp-hero__cta-container a');
  const secondaryCta = element.querySelector('a.cmp-hero__secondary-cta, .cmp-hero__secondary-cta-container a');
  const image = element.querySelector('.cmp-hero__image-container img, picture img, img');

  // --- Empty-block guard ---
  if (!heading && !description && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional). Field: image (imageAlt is collapsed into the img's alt attr).
  if (image) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(image);
    cells.push([imageCell]);
  } else {
    // Preserve the 3-row structure — keep the image row present but empty.
    cells.push(['']);
  }

  // Row 3: text (heading, subheading, CTA). Field: text (richtext).
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (description) textCell.appendChild(description);
  if (primaryCta) textCell.appendChild(primaryCta);
  if (secondaryCta) textCell.appendChild(secondaryCta);
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
