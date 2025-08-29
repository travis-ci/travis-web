import BasicRoute from 'travis/routes/basic';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';

export default BasicRoute.extend(TailwindBaseMixin, {
  needsAuth: true,
  titleToken: 'Licensing Information',

  beforeModel() {
    this._instantScrollTop();
    return this._super(...arguments);
  },

  activate() {
    this._super(...arguments);
  },

  _instantScrollTop() {
    const root = document.documentElement;
    const body = document.body;
    const prevRoot = root && root.style ? root.style.scrollBehavior : '';
    const prevBody = body && body.style ? body.style.scrollBehavior : '';
    if (root && root.style) root.style.scrollBehavior = 'auto';
    if (body && body.style) body.style.scrollBehavior = 'auto';
    try {
      window.scrollTo(0, 0);
      if (root) root.scrollTop = 0;
      if (body) body.scrollTop = 0;
    } finally {
      if (root && root.style) root.style.scrollBehavior = prevRoot || '';
      if (body && body.style) body.style.scrollBehavior = prevBody || '';
    }
  }
});
