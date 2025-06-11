import { modifier } from 'ember-modifier';

export default modifier((element, [handler]) => {
  window.addEventListener('scroll', handler);

  return () => {
    window.removeEventListener('scroll', handler);
  };
});
