export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-feature-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-feature-img-col');
        }
      }

      // tag an eyebrow label: a short paragraph immediately followed by a heading
      const first = col.firstElementChild;
      if (first && first.tagName === 'P') {
        const next = first.nextElementSibling;
        if (next && /^H[1-6]$/.test(next.tagName)
          && first.textContent.trim().length <= 40) {
          first.classList.add('columns-feature-eyebrow');
        }
      }
    });
  });
}
