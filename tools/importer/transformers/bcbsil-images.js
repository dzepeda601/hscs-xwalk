/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: resolve BCBSIL lazy-loaded images.
 *
 * Several images on the homepage are lazy-loaded by the source site. At scrape
 * time the <img> still carried a temporary blob: placeholder instead of the
 * real asset URL, so those blobs were captured. This transformer swaps each
 * blob src for the real published image URL.
 *
 * Images are matched by their alt text (stable, human-authored). The About Us
 * community-garden image has empty alt, so it is matched positionally as the
 * image inside the #AboutUs 2-column grid.
 *
 * Real URLs verified against the live page after lazy-load resolution.
 */

const ALT_TO_URL = {
  'A little girl playing doctor with a stethoscope.':
    'https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989740651/tab-par/teaser/image.coreimg.82.512.jpeg/1747884988221/girl-playing-doctor-with-stethescope.jpeg',
  'Father taking a picture of his two young children brushing their teeth in the bathroom.':
    'https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989757905/tab-par/teaser/image.coreimg.82.512.jpeg/1744741498020/dad-selfie-kids-brushing-teeth.jpeg',
  'Woman holding her toddler while picking up prescription at the pharmacy':
    'https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989754151/tab-par/teaser/image.coreimg.82.512.jpeg/1744741491049/pharmacist-assisting-mother-holding-daughter-.jpeg',
  'Young man stands on a country road looking out to the horizon':
    'https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989773338/tab-par/teaser/image.coreimg.82.512.jpeg/1744741511741/man-standing-smiling-on-road-sunny-day.jpeg',
  'Woman sits on her couch while talking to a doctor on her mobile tablet.':
    'https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/find-care-table/master/_jcr_content/root/tabs_copy/item_1718989782622/tab-par/teaser/image.coreimg.82.512.jpeg/1744741524391/woman-virtual-doctor-visit-couch.jpeg',
  'Group of professionals at a table having a meeting':
    'https://www.bcbsil.com/content/experience-fragments/bcbs-v2/public_sites/all_states_838514283/en/promotional_banners/careers/careers-il/_jcr_content/root/teaser_copy_13104169/image.coreimg.82.1024.jpeg/1772656138561/group-of-professionals-at-a-table.jpeg',
};

const ABOUT_US_IMAGE_URL =
  'https://www.bcbsil.com/content/bcbs-v2/public-sites/bcbsil/en/home/_jcr_content/root/main-par/section_2069978393_c/section-par/grid_container/grid/image.coreimg.82.1024.jpeg/1762298521774/community-garden-volunteers.jpeg';

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  element.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!src.startsWith('blob:')) return;

    const alt = img.getAttribute('alt') || '';
    if (ALT_TO_URL[alt]) {
      img.setAttribute('src', ALT_TO_URL[alt]);
    } else if (!alt) {
      // The only empty-alt blob image is the About Us community-garden photo.
      img.setAttribute('src', ABOUT_US_IMAGE_URL);
    }
  });
}
