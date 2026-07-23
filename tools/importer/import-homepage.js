/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import tabsNetworkParser from './parsers/tabs-network.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bcbsil-cleanup.js';
import sectionsTransformer from './transformers/bcbsil-sections.js';
import imagesTransformer from './transformers/bcbsil-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-teaser': cardsTeaserParser,
  'columns-feature': columnsFeatureParser,
  'tabs-network': tabsNetworkParser,
  'cards-article': cardsArticleParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'BCBSIL homepage: hero banner, jump-link nav, audience teaser grid (Individual/Medicare/Medicaid), producer banner, member account spotlight, network tabs, careers callout, articles/insights grid, and about us section.',
  urls: [
    'https://www.bcbsil.com/',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['#main-content div.hero.cmp-hero--color-dark-blue'],
    },
    {
      name: 'cards-teaser',
      instances: ['#SmartChoice div.grid-container.cmp-grid-container--3col'],
    },
    {
      name: 'columns-feature',
      instances: [
        '#main-content div.teaser.cmp-teaser--position-right.cmp-button--secondary:not(.cmp-teaser--aspect-4-3)',
        '#main-content div.teaser.cmp-teaser--position-right.cmp-teaser--aspect-4-3',
        '#AboutUs div.grid-container.cmp-grid-container--2col',
      ],
    },
    {
      name: 'tabs-network',
      instances: ['#OurNetwork div.tabs'],
    },
    {
      name: 'cards-article',
      instances: ['#ArticlesandInsights section.cmp-article-grid'],
    },
    {
      name: 'section-producer-banner',
      instances: ['#main-content div.section.cmp-section--background-color-dark-blue:has(.cmp-experiencefragment--producer-banner)'],
      section: 'dark-blue',
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero',
      selector: '#main-content div.hero.cmp-hero--color-dark-blue',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'jump-link-nav',
      name: 'Jump Link Navigation',
      selector: '#main-content div.jump-link-navigation',
      style: null,
      blocks: [],
      defaultContent: ['#main-content div.jump-link-navigation'],
    },
    {
      id: 'smart-choice',
      name: 'Smart Choice',
      selector: '#SmartChoice',
      style: 'light',
      blocks: ['cards-teaser'],
      defaultContent: ['#SmartChoice div.cmp-title h2'],
    },
    {
      id: 'producer-banner',
      name: 'Producer Banner',
      selector: '#main-content div.section.cmp-section--background-color-dark-blue:has(.cmp-experiencefragment--producer-banner)',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['#main-content div.section.cmp-section--background-color-dark-blue:has(.cmp-experiencefragment--producer-banner) h2'],
    },
    {
      id: 'member-spotlight',
      name: 'Member Spotlight',
      selector: '#main-content div.section.cmp-section--background-color-white:has(div.columns-feature)',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'our-network',
      name: 'Our Network',
      selector: '#OurNetwork',
      style: 'light',
      blocks: ['tabs-network'],
      defaultContent: ['#OurNetwork div.cmp-title'],
    },
    {
      id: 'careers',
      name: 'Careers',
      selector: '#main-content div.section.cmp-section--background-color-dark-blue:has(.cmp-experiencefragment--careers)',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'articles-insights',
      name: 'Articles and Insights',
      selector: '#ArticlesandInsights',
      style: 'light',
      blocks: ['cards-article'],
      defaultContent: ['#ArticlesandInsights div.cmp-title'],
    },
    {
      id: 'about-us',
      name: 'About Us',
      selector: '#AboutUs',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after (only if 2+ sections)
const transformers = [
  cleanupTransformer,
  imagesTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    // Skip section-only mappings - handled by the sections transformer
    if (blockDef.name.startsWith('section-')) return;
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
