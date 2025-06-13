import { modifier } from 'ember-modifier';

export default modifier((_, [handler]) => {
  const element = document.querySelector('.wrapper');
  const resizeObserver = new ResizeObserver(handler);

  resizeObserver.observe(element);

  return () => {
    resizeObserver.unobserve(element);
  };
});
