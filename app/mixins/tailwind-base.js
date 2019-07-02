import Mixin from '@ember/object/mixin';

export const ASSET_NAME = 'tailwind-base';
const elementId = `${ASSET_NAME}-css`;

export default Mixin.create({
  beforeModel: function () {
    const link = document.createElement('link');
    link.href = `assets/${ASSET_NAME}.css`;
    link.rel = 'stylesheet';
    link.id = elementId;

    if (!document.getElementById(elementId)) {
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    return this._super(...arguments);
  },

  deactivate() {
    document.getElementById(elementId).remove();
  },
});
