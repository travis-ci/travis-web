import { modifier } from 'ember-modifier';
import { scheduleOnce } from '@ember/runloop';

// One-shot after-render scroll to the current URL hash, if present
export default modifier(() => {
  const doScroll = () => {
    const hash = (window.location && window.location.hash) || '';
    if (!hash) return;
    try {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    } catch (_e) {
    }
  };

  scheduleOnce('afterRender', null, () => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => requestAnimationFrame(doScroll));
    } else {
      doScroll();
    }
  });
});
