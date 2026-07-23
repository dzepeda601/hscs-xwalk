/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: BCBSIL section breaks and section metadata.
 *
 * The homepage template defines 9 ordered sections (see
 * tools/importer/page-templates.json). This transformer inserts an <hr>
 * section break before every section except the first, and a Section Metadata
 * block after every section that declares a `style`.
 *
 * All section selectors come from payload.template.sections (verified against
 * the live page: each resolves to exactly one element). Runs in afterTransform
 * only, per the section-transformer contract.
 *
 * Expected on the homepage template: 8 <hr> (9 sections - 1) and 4 Section
 * Metadata blocks (smart-choice=light, producer-banner=dark-blue,
 * our-network=light, articles-insights=light).
 */

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!Array.isArray(sections) || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve each section's anchor element once, preserving template order.
  const resolved = sections.map((section) => ({
    section,
    el: element.querySelector(section.selector),
  }));

  // Process in reverse so inserting <hr>/metadata for a later section does not
  // shift the DOM position of earlier sections we still need to locate.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, el } = resolved[i];
    if (!el) {
      // eslint-disable-next-line no-console
      console.warn('Section selector did not match, skipping:', section.selector);
      continue;
    }

    // Section Metadata block after the section, when a style is declared.
    if (section.style) {
      const block = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (el.nextSibling) {
        el.parentNode.insertBefore(block, el.nextSibling);
      } else {
        el.parentNode.appendChild(block);
      }
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      el.parentNode.insertBefore(hr, el);
    }
  }
}
