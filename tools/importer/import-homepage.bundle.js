/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const heading = element.querySelector(".cmp-hero__heading, h1, h2");
    const description = element.querySelector(".cmp-hero__description, .cmp-hero__content-container p");
    const primaryCta = element.querySelector("a.cmp-hero__cta, .cmp-hero__cta-container a");
    const secondaryCta = element.querySelector("a.cmp-hero__secondary-cta, .cmp-hero__secondary-cta-container a");
    const image = element.querySelector(".cmp-hero__image-container img, picture img, img");
    if (!heading && !description && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(image);
      cells.push([imageCell]);
    } else {
      cells.push([""]);
    }
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    if (description) textCell.appendChild(description);
    if (primaryCta) textCell.appendChild(primaryCta);
    if (secondaryCta) textCell.appendChild(secondaryCta);
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-teaser.js
  function parse2(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".cmp-value-prop, .value-prop > .cmp-value-prop"));
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector("img.cmp-value-prop__image, img");
      let imageCell = "";
      if (image) {
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(" field:image "));
        frag.appendChild(image);
        imageCell = frag;
      }
      const heading = card.querySelector(".cmp-value-prop__proposition");
      const description = card.querySelector(".cmp-value-prop__description");
      const cta = card.querySelector("a.cmp-value-prop__cta, .cmp-value-prop__text-wrap a");
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (heading) {
        const h = document.createElement("h3");
        h.innerHTML = heading.innerHTML;
        textFrag.appendChild(h);
      }
      if (description) textFrag.appendChild(description);
      if (cta) textFrag.appendChild(cta);
      cells.push([imageCell, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse3(element, { document }) {
    const cells = [];
    let columnEls = [];
    const gridItems = element.querySelector(":scope .cmp-grid-container__items > .aem-Grid, :scope .cmp-grid-container__items");
    if (gridItems) {
      columnEls = Array.from(gridItems.children).filter(
        (c) => c.matches('.text, .image, .video, [class*="text"], [class*="image"], [class*="video"], [class*="teaser"]')
      );
    }
    if (columnEls.length < 2) {
      const textCol = element.querySelector(
        '.cmp-teaser__content, .cmp-teaser__text-container, .cmp-text, [class*="content"]'
      );
      const mediaCol = element.querySelector(
        '.cmp-teaser__image, .cmp-image, .cmp-video, video, [class*="image"], [class*="video"]'
      );
      columnEls = [textCol, mediaCol].filter(Boolean);
      if (element.matches('.cmp-teaser--position-left, [class*="position-left"]') && columnEls.length === 2) {
        columnEls = [mediaCol, textCol];
      }
    }
    if (columnEls.length < 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push(columnEls.map((col) => col));
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-network.js
  function parse4(element, { document }) {
    const tabLabels = Array.from(element.querySelectorAll(".cmp-tabs__tablist > li.cmp-tabs__tab, li.cmp-tabs__tab"));
    const tabPanels = Array.from(element.querySelectorAll(".cmp-tabs__tabpanel"));
    if (!tabLabels.length || !tabPanels.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const panelById = /* @__PURE__ */ new Map();
    tabPanels.forEach((panel) => {
      if (panel.id) panelById.set(panel.id, panel);
    });
    const cells = [];
    tabLabels.forEach((label, index) => {
      let panel = null;
      if (label.id && label.id.endsWith("-tab")) {
        panel = panelById.get(label.id.slice(0, -"-tab".length));
      }
      if (!panel) panel = tabPanels[index] || null;
      const titleFrag = document.createDocumentFragment();
      titleFrag.appendChild(document.createComment(" field:title "));
      const titleP = document.createElement("p");
      titleP.textContent = label.textContent.trim();
      titleFrag.appendChild(titleP);
      const contentFrag = document.createDocumentFragment();
      const heading = panel && panel.querySelector(".cmp-teaser__title, h3, h4, h5");
      const image = panel && panel.querySelector(".cmp-teaser__media img, .cmp-image img, img");
      const subtitle = panel && panel.querySelector(".cmp-teaser__subtitle");
      const description = panel && panel.querySelector(".cmp-teaser__description, .cmp-teaser__content .cmp-text");
      const cta = panel && panel.querySelector("a.cmp-teaser__action-link, .cmp-teaser__action-container a");
      if (heading) {
        contentFrag.appendChild(document.createComment(" field:content_heading "));
        contentFrag.appendChild(heading);
      }
      if (image) {
        contentFrag.appendChild(document.createComment(" field:content_image "));
        contentFrag.appendChild(image);
      }
      const richParts = [];
      if (subtitle) richParts.push(subtitle);
      if (description) richParts.push(description);
      if (cta) richParts.push(cta);
      if (richParts.length) {
        contentFrag.appendChild(document.createComment(" field:content_richtext "));
        richParts.forEach((p) => contentFrag.appendChild(p));
      }
      cells.push([titleFrag, contentFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-network", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const cards = Array.from(element.querySelectorAll("li.cmp-article-grid__article, .cmp-article-grid__article"));
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const container = card.querySelector("a.cmp-article-grid__item-container, a[href]");
      const href = container ? container.getAttribute("href") : null;
      const image = card.querySelector("img.cmp-article-grid__item-image, img");
      let imageCell = "";
      if (image) {
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(" field:image "));
        frag.appendChild(image);
        imageCell = frag;
      }
      const category = card.querySelector(".cmp-article-grid__item-category");
      const heading = card.querySelector(".cmp-article-grid__item-description, h3, h2, h4");
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (category) {
        const cat = document.createElement("p");
        cat.textContent = category.textContent.trim();
        textFrag.appendChild(cat);
      }
      if (heading) {
        const headingTag = heading.tagName && /^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : "h3";
        const h = document.createElement(headingTag);
        const titleText = heading.textContent.replace(/\s+/g, " ").trim();
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          if (container && container.getAttribute("title")) a.setAttribute("title", container.getAttribute("title"));
          a.textContent = titleText;
          h.appendChild(a);
        } else {
          h.textContent = titleText;
        }
        textFrag.appendChild(h);
      }
      cells.push([imageCell, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/bcbsil-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        // Data layer stub. Found: <div id="datalayer-page-info"> (line 2)
        "#datalayer-page-info",
        // WalkMe injected DOM. Found: <div class="walkme-to-destroy ...">,
        // <iframe id="walkme-native-functions">, <walkme-copilot-root id="walkme-copilot-root">,
        // and many div.walkme-* wrappers (lines 15122+).
        '[class*="walkme"]',
        '[id*="walkme"]',
        "walkme-copilot-root",
        // Skip-to-content accessibility link. Found: <a id="skip-nav"> (line 11)
        "#skip-nav",
        // Remnant script/style/noscript nodes if any survived the scrape.
        "script",
        "style",
        "noscript"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".notification",
        ".cmp-notification"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "video-js",
        ".video-js",
        ".cmp-teaser__video",
        ".vjs-text-track-settings",
        '[class*="vjs-"]',
        '[id*="brightcove"]',
        ".cmp-teaser__transcript"
      ]);
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        // Header mega-nav experience fragment (sibling before #main-content).
        // Found: <div class="cmp-experiencefragment cmp-experiencefragment--header"> (line 17)
        ".cmp-experiencefragment--header",
        // Footer experience fragment (sibling after #main-content).
        // Found: <div class="cmp-experiencefragment cmp-experiencefragment--footer"> (line 15001)
        ".cmp-experiencefragment--footer",
        // Raw header/footer landmarks as a safety net for the same chrome.
        // Found: <header class="cmp-mega-nav ..."> (line 20), <footer class="footer ..."> (line 15004)
        "header",
        "footer",
        // Safe leftover elements.
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-data-layer-enabled");
        el.removeAttribute("data-cmp-hook-image");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/bcbsil-sections.js
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!Array.isArray(sections) || sections.length < 2) return;
    const doc = element.ownerDocument;
    const resolved = sections.map((section) => ({
      section,
      el: element.querySelector(section.selector)
    }));
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (!el) {
        console.warn("Section selector did not match, skipping:", section.selector);
        continue;
      }
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (el.nextSibling) {
          el.parentNode.insertBefore(block, el.nextSibling);
        } else {
          el.parentNode.appendChild(block);
        }
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        el.parentNode.insertBefore(hr, el);
      }
    }
  }

  // tools/importer/transformers/bcbsil-images.js
  var ALT_TO_URL = {
    "A little girl playing doctor with a stethoscope.": "https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989740651/tab-par/teaser/image.coreimg.82.512.jpeg/1747884988221/girl-playing-doctor-with-stethescope.jpeg",
    "Father taking a picture of his two young children brushing their teeth in the bathroom.": "https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989757905/tab-par/teaser/image.coreimg.82.512.jpeg/1744741498020/dad-selfie-kids-brushing-teeth.jpeg",
    "Woman holding her toddler while picking up prescription at the pharmacy": "https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989754151/tab-par/teaser/image.coreimg.82.512.jpeg/1744741491049/pharmacist-assisting-mother-holding-daughter-.jpeg",
    "Young man stands on a country road looking out to the horizon": "https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989773338/tab-par/teaser/image.coreimg.82.512.jpeg/1744741511741/man-standing-smiling-on-road-sunny-day.jpeg",
    "Woman sits on her couch while talking to a doctor on her mobile tablet.": "https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989782622/tab-par/teaser/image.coreimg.82.512.jpeg/1744741524391/woman-virtual-doctor-visit-couch.jpeg",
    "Group of professionals at a table having a meeting": "https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/careers/careers-il/_jcr_content/root/teaser_copy_13104169/image.coreimg.82.1024.jpeg/1772656138561/group-of-professionals-at-a-table.jpeg"
  };
  var ABOUT_US_IMAGE_URL = "https://www.bcbsil.com/content/bcbs-v2/public-sites/bcbsil/en/home/_jcr_content/root/main-par/section_2069978393_c/section-par/grid_container/grid/image.coreimg.82.1024.jpeg/1762298521774/community-garden-volunteers.jpeg";
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!src.startsWith("blob:")) return;
      const alt = img.getAttribute("alt") || "";
      if (ALT_TO_URL[alt]) {
        img.setAttribute("src", ALT_TO_URL[alt]);
      } else if (!alt) {
        img.setAttribute("src", ABOUT_US_IMAGE_URL);
      }
    });
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-teaser": parse2,
    "columns-feature": parse3,
    "tabs-network": parse4,
    "cards-article": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "BCBSIL homepage: hero banner, jump-link nav, audience teaser grid (Individual/Medicare/Medicaid), producer banner, member account spotlight, network tabs, careers callout, articles/insights grid, and about us section.",
    urls: [
      "https://www.bcbsil.com/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: ["#main-content div.hero.cmp-hero--color-dark-blue"]
      },
      {
        name: "cards-teaser",
        instances: ["#SmartChoice div.grid-container.cmp-grid-container--3col"]
      },
      {
        name: "columns-feature",
        instances: [
          "#main-content div.teaser.cmp-teaser--position-right.cmp-button--secondary:not(.cmp-teaser--aspect-4-3)",
          "#main-content div.teaser.cmp-teaser--position-right.cmp-teaser--aspect-4-3",
          "#AboutUs div.grid-container.cmp-grid-container--2col"
        ]
      },
      {
        name: "tabs-network",
        instances: ["#OurNetwork div.tabs"]
      },
      {
        name: "cards-article",
        instances: ["#ArticlesandInsights section.cmp-article-grid"]
      },
      {
        name: "section-producer-banner",
        instances: ["#main-content div.section.cmp-section--background-color-dark-blue:has(.cmp-experiencefragment--producer-banner)"],
        section: "dark-blue"
      }
    ],
    sections: [
      {
        id: "hero",
        name: "Hero",
        selector: "#main-content div.hero.cmp-hero--color-dark-blue",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "jump-link-nav",
        name: "Jump Link Navigation",
        selector: "#main-content div.jump-link-navigation",
        style: null,
        blocks: [],
        defaultContent: ["#main-content div.jump-link-navigation"]
      },
      {
        id: "smart-choice",
        name: "Smart Choice",
        selector: "#SmartChoice",
        style: "light",
        blocks: ["cards-teaser"],
        defaultContent: ["#SmartChoice div.cmp-title h2"]
      },
      {
        id: "producer-banner",
        name: "Producer Banner",
        selector: "#main-content div.section.cmp-section--background-color-dark-blue:has(.cmp-experiencefragment--producer-banner)",
        style: "dark-blue",
        blocks: [],
        defaultContent: ["#main-content div.section.cmp-section--background-color-dark-blue:has(.cmp-experiencefragment--producer-banner) h2"]
      },
      {
        id: "member-spotlight",
        name: "Member Spotlight",
        selector: "#main-content div.section.cmp-section--background-color-white:has(div.columns-feature)",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "our-network",
        name: "Our Network",
        selector: "#OurNetwork",
        style: "light",
        blocks: ["tabs-network"],
        defaultContent: ["#OurNetwork div.cmp-title"]
      },
      {
        id: "careers",
        name: "Careers",
        selector: "#main-content div.section.cmp-section--background-color-dark-blue:has(.cmp-experiencefragment--careers)",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "articles-insights",
        name: "Articles and Insights",
        selector: "#ArticlesandInsights",
        style: "light",
        blocks: ["cards-article"],
        defaultContent: ["#ArticlesandInsights div.cmp-title"]
      },
      {
        id: "about-us",
        name: "About Us",
        selector: "#AboutUs",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    transform3,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
