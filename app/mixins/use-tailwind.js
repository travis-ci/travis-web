import Mixin from '@ember/object/mixin';

export const ASSET_NAME = 'travis-tailwind';

export default Mixin.create({
  beforeModel: function () {
    const elementId = `${ASSET_NAME}-css`;
    const link = document.createElement('link');
    link.href = `assets/${ASSET_NAME}.css`;
    link.rel = 'stylesheet';
    link.id = elementId;

    if (!document.querySelector(`#${elementId}`)) {
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    return this._super(...arguments);
  }
});
