/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: BCBSIL site-wide cleanup.
 *
 * Source is an AEM Sites (WCM core components) page. The DOM carries a lot of
 * non-authorable shell chrome and injected widgets. This transformer scopes the
 * import to the #main-content body and strips everything an author would not
 * create or edit.
 *
 * All selectors below were verified against migration-work/cleaned.html
 * (line references noted inline). None are guessed.
 */

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Injected/analytics noise removed before parsing so it can never be
    // matched into a block cell.
    WebImporter.DOMUtils.remove(element, [
      // Data layer stub. Found: <div id="datalayer-page-info"> (line 2)
      '#datalayer-page-info',
      // WalkMe injected DOM. Found: <div class="walkme-to-destroy ...">,
      // <iframe id="walkme-native-functions">, <walkme-copilot-root id="walkme-copilot-root">,
      // and many div.walkme-* wrappers (lines 15122+).
      '[class*="walkme"]',
      '[id*="walkme"]',
      'walkme-copilot-root',
      // Skip-to-content accessibility link. Found: <a id="skip-nav"> (line 11)
      '#skip-nav',
      // Remnant script/style/noscript nodes if any survived the scrape.
      'script',
      'style',
      'noscript',
    ]);

    // Dismissible notification/alert banners are transient site-wide popups,
    // not page content. Found: two <div class="notification cmp-notification--info">
    // banners (severe weather + Medicaid) above the hero (lines 14233, 14246).
    // Remove the whole banners so they are never imported.
    WebImporter.DOMUtils.remove(element, [
      '.notification',
      '.cmp-notification',
    ]);

    // Brightcove/video.js player chrome from the member-spotlight teaser.
    // The embedded player injects a control bar, captions settings modal and
    // loading text that was scraped into the producer-banner cell as raw text.
    // The teaser also carries a video transcript that is collapsed behind a
    // "Read Transcript" accordion on the live page (not visible content).
    // Remove the player widget, its injected control DOM, and the transcript.
    WebImporter.DOMUtils.remove(element, [
      'video-js',
      '.video-js',
      '.cmp-teaser__video',
      '.vjs-text-track-settings',
      '[class*="vjs-"]',
      '[id*="brightcove"]',
      '.cmp-teaser__transcript',
    ]);
  }

  if (hookName === 'afterTransform') {
    // Scope to #main-content: the header and footer are handled by separate
    // navigation/footer migrations, so strip their experience fragments plus
    // any global chrome that sits outside the main content body.
    WebImporter.DOMUtils.remove(element, [
      // Header mega-nav experience fragment (sibling before #main-content).
      // Found: <div class="cmp-experiencefragment cmp-experiencefragment--header"> (line 17)
      '.cmp-experiencefragment--header',
      // Footer experience fragment (sibling after #main-content).
      // Found: <div class="cmp-experiencefragment cmp-experiencefragment--footer"> (line 15001)
      '.cmp-experiencefragment--footer',
      // Raw header/footer landmarks as a safety net for the same chrome.
      // Found: <header class="cmp-mega-nav ..."> (line 20), <footer class="footer ..."> (line 15004)
      'header',
      'footer',
      // Safe leftover elements.
      'iframe',
      'link',
      'noscript',
    ]);

    // Strip WCM-specific tracking/layout attributes that carry no authorable
    // meaning. Applied only where present so nothing else is disturbed.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-data-layer-enabled');
      el.removeAttribute('data-cmp-hook-image');
      el.removeAttribute('onclick');
    });
  }
}
