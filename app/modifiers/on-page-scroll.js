import { modifier } from 'ember-modifier';

export default modifier((_, [handler]) => {
  window.addEventListener('scroll', handler);

  return () => {
    window.removeEventListener('scroll', handler);
  };
});
